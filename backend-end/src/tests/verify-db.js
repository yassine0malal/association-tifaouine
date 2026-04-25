/**
 * =========================================================
 * Script d'Assurance Qualité des Données (Data QA)
 * =========================================================
 * Cet outil d'audit garantit l'intégrité de la base de données 
 * et sa cohérence avec le système de fichiers physique.
 */

const { Sequelize } = require('sequelize');
const config = require('../config/config.js');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false
});

async function runDataQualityAudit() {
  try {
    console.log('\n[INFO] Démarrage de l\'audit d\'intégrité des données...');

    await sequelize.authenticate();
    
    let anomaliesCount = 0;
    
    // 1. TEST D'INTÉGRITÉ PHYSIQUE DES FICHIERS (I/O)
    console.log('[INFO] Étape 1 : Vérification de la correspondance base de données / système de fichiers');
    const [ressources] = await sequelize.query(`SELECT id, url, type, projet_id, evenement_id FROM ressource`);
    
    let validPhysicalFiles = 0;
    for (const r of ressources) {
      const physicalPath = path.join(__dirname, '../../src', r.url);
      if (fs.existsSync(physicalPath)) {
        validPhysicalFiles++;
      } else {
        console.error(`[ERREUR] Fichier manquant physiquement : ${r.url} (ID: ${r.id})`);
        anomaliesCount++;
      }
    }
    console.log(`[SUCCÈS] ${validPhysicalFiles}/${ressources.length} fichiers vérifiés avec succès sur le disque.\n`);

    // 2. CHASSE AUX DONNÉES ORPHELINES
    console.log('[INFO] Étape 2 : Détection des ressources orphelines');
    const orphelines = ressources.filter(r => r.projet_id === null && r.evenement_id === null && !r.url.includes('/association/') && !['document', 'rapport', 'guide'].includes(r.type));
    
    if (orphelines.length > 0) {
        console.error(`[ERREUR] ${orphelines.length} ressources ne sont associées à aucune entité parente.`);
        anomaliesCount += orphelines.length;
    } else {
        console.log(`[SUCCÈS] Aucune donnée orpheline détectée.\n`);
    }

    // 3. VÉRIFICATION DE L'UNICITÉ
    console.log('[INFO] Étape 3 : Audit de déduplication des URLs');
    const [doublons] = await sequelize.query(`
        SELECT url, COUNT(url) as occurrences 
        FROM ressource 
        GROUP BY url HAVING COUNT(url) > 1
    `);
    if (doublons.length > 0) {
        console.error(`[ERREUR] Nombre de duplications détectées : ${doublons.length}`);
        anomaliesCount += doublons.length;
    } else {
        console.log(`[SUCCÈS] Contrainte d'unicité respectée pour toutes les données.\n`);
    }

    // 4. TEST D'INTÉGRITÉ RÉFÉRENTIELLE (FOREIGN KEYS)
    console.log('[INFO] Étape 4 : Validation de l\'intégrité référentielle');
    let fkAnomalies = 0;
    for (const r of ressources) {
        if (r.projet_id) {
            const [proj] = await sequelize.query(`SELECT id FROM projet WHERE id = ${r.projet_id}`);
            if (proj.length === 0) {
                console.error(`[ERREUR] Rupture de clé étrangère (projet) pour la ressource ID: ${r.id}`);
                fkAnomalies++;
            }
        }
        if (r.evenement_id) {
            const [ev] = await sequelize.query(`SELECT id FROM evenement WHERE id = ${r.evenement_id}`);
            if (ev.length === 0) {
                console.error(`[ERREUR] Rupture de clé étrangère (événement) pour la ressource ID: ${r.id}`);
                fkAnomalies++;
            }
        }
    }
    if (fkAnomalies === 0) {
        console.log(`[SUCCÈS] Toutes les relations de clés étrangères sont valides.\n`);
    } else {
        anomaliesCount += fkAnomalies;
    }

    // 5. AUDIT SPÉCIFIQUE : MODULE DOCUMENTS & COUVERTURES
    console.log('[INFO] Étape 5 : Audit du module Documents & Couvertures');
    const [docs] = await sequelize.query(`
        SELECT id, titre_fr, url, image_couverture, is_featured, type 
        FROM ressource 
        WHERE projet_id IS NULL AND evenement_id IS NULL AND type IN ('document', 'rapport', 'guide')
    `);

    let featuredCount = 0;
    for (const d of docs) {
        // Vérifier si la couverture est renseignée
        if (!d.image_couverture) {
            console.error(`[ERREUR] Couverture manquante pour le document ID: ${d.id} (${d.titre_fr})`);
            anomaliesCount++;
        } else {
            // Vérifier si le fichier de couverture existe sur le disque
            const physicalCoverPath = path.join(__dirname, '../../src', d.image_couverture);
            if (!fs.existsSync(physicalCoverPath)) {
                console.error(`[ERREUR] Image de couverture manquante sur le disque : ${d.image_couverture} (ID: ${d.id})`);
                anomaliesCount++;
            }
        }

        // Compter les documents "featured"
        if (d.is_featured) featuredCount++;
    }

    if (featuredCount === 0) {
        console.error(`[ERREUR] Aucun document "essentiel" (is_featured=true) n'a été détecté.`);
        anomaliesCount++;
    } else if (featuredCount > 1) {
        console.error(`[ERREUR] Plusieurs documents (${featuredCount}) sont marqués comme "essentiel". Un seul est autorisé.`);
        anomaliesCount++;
    } else {
        console.log(`[SUCCÈS] Structure du module Documents validée (Featured: OK, Couvertures: OK).\n`);
    }

    // CONCLUSION STRATÉGIQUE
    console.log('---------------------------------------------------------');
    if (anomaliesCount === 0) {
        console.log('[RÉSULTAT] STATUT DE L\'AUDIT : RÉUSSITE TOTALE');
        console.log('---------------------------------------------------------');
        console.log('L\'architecture des données respecte les exigences de production :');
        console.log(' - Validité physique stricte garantie (I/O OK)');
        console.log(' - Tolérance zéro sur les corruptions et doublons confirmée');
        console.log(' - Modèle relationnel intact');
        console.log(' - Module Documents & Couvertures conforme');
        console.log('\nValidation technique accordée pour le déploiement.\n');
    } else {
        console.log(`[ALERTE] ÉCHEC DE L'AUDIT : ${anomaliesCount} anomalies nécessitent une intervention.\n`);
        process.exit(1);
    }

  } catch (error) {
    console.error('[CRITIQUE] Exception levée durant l\'audit :', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runDataQualityAudit();
