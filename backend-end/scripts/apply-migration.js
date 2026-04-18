const { sequelize } = require('../src/config/database');
const { QueryTypes } = require('sequelize');

async function applySpecificMigration() {
    console.log("--- Tentative d'application forcée de la migration evenement_id ---");
    
    try {
        // 1. Ajouter la colonne manuellement via SQL
        await sequelize.query(`
            ALTER TABLE ressource 
            ADD COLUMN IF NOT EXISTS evenement_id INTEGER 
            REFERENCES evenement(id) ON DELETE CASCADE;
        `);
        console.log("✅ Colonne evenement_id ajoutée avec succès (ou déjà présente).");

        // 2. Marquer la migration comme faite dans SequelizeMeta pour éviter les erreurs futures
        const migrationName = '20260410120000-add-evenement-id-to-ressource.js';
        await sequelize.query(
            "INSERT INTO \"SequelizeMeta\" (name) VALUES (:name) ON CONFLICT (name) DO NOTHING;",
            {
                replacements: { name: migrationName },
                type: QueryTypes.INSERT
            }
        );
        console.log(`✅ Migration ${migrationName} marquée comme terminée.`);

    } catch (error) {
        console.error("❌ Erreur lors de l'application manuelle :", error.message);
    } finally {
        await sequelize.close();
    }
}

applySpecificMigration();
