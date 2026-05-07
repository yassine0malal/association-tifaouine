const { sequelize } = require('../config/database');
const ressourceRepository = require('../repositories/ressource.repository');
const { toDocumentDTO } = require('../dto/ressource.dto');
const fs = require('fs');
const path = require('path');

class RessourceService {
    async getAllRessources(filters = {}) {
        return await ressourceRepository.findAll(filters);
    }

    async getRessourceById(id) {
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) throw new Error(`La ressource avec l'ID ${id} n'existe pas`);
        return ressource;
    }

    /**
     * Création d'une ressource.
     * Vérifie si nom_original existe déjà pour le même projet/événement.
     * Si oui → erreur 409 (le fichier uploadé est supprimé du disque).
     */
    async createRessource(data, filePath = null) {
        console.log('[DEBUG SERVICE CREATE] Données reçues:', {
            type: data.type,
            projet_id: data.projet_id,
            evenement_id: data.evenement_id,
            nom_original: data.nom_original
        });

        if (data.nom_original) {
            console.log('[DEBUG SERVICE CREATE] Vérification doublon pour:', {
                nom_original: data.nom_original,
                projet_id: data.projet_id,
                evenement_id: data.evenement_id
            });

            const doublon = await ressourceRepository.findDuplicate(
                data.nom_original,
                data.projet_id    || null,
                data.evenement_id || null
            );
            if (doublon) {
                console.warn('[DEBUG SERVICE CREATE] Doublon trouvé!');
                if (filePath && fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (_) {}
                }
                const err = new Error(`Ce fichier existe déjà : "${data.nom_original}"`);
                err.status = 409;
                throw err;
            }
        }

        // Auto-calcul file_size et file_type depuis le fichier physique
        if (filePath && fs.existsSync(filePath)) {
            try {
                const stat = fs.statSync(filePath);
                data.file_size = stat.size;
                console.log('[DEBUG SERVICE CREATE] File size calculé:', data.file_size);
            } catch (_) {}
        }
        if (data.nom_original && !data.file_type) {
            const ext = path.extname(data.nom_original).toLowerCase().replace('.', '');
            if (ext) data.file_type = ext;
            console.log('[DEBUG SERVICE CREATE] File type calculé:', data.file_type);
        }

        // Si is_featured = true → retirer le featured actuel (un seul à la fois)
        return await sequelize.transaction(async (t) => {
            if (data.is_featured) {
                console.log('[DEBUG SERVICE CREATE] Unsetting previous featured');
                await ressourceRepository.unsetAllFeatured({ transaction: t });
            }
            console.log('[DEBUG SERVICE CREATE] Création de la ressource avec:', {
                type: data.type,
                projet_id: data.projet_id,
                evenement_id: data.evenement_id
            });
            const created = await ressourceRepository.create(data, { transaction: t });
            console.log('[DEBUG SERVICE CREATE] Ressource créée avec ID:', created.id);
            return created;
        });
    }

    async updateRessource(id, updateData) {
        console.log('[DEBUG SERVICE UPDATE] ID:', id);
        console.log('[DEBUG SERVICE UPDATE] Données reçues:', updateData);

        const ressource = await ressourceRepository.findById(id);
        if (!ressource) throw new Error("Ressource introuvable");

        // Extraire les marqueurs de suppression d'anciens fichiers
        const oldUrl = updateData._oldUrl;
        const oldImageCouverture = updateData._oldImageCouverture;

        // Filtrer les champs null et les champs internes
        const cleanedData = {};
        for (const [key, value] of Object.entries(updateData)) {
            // Ignorer les champs internes (commençant par _)
            if (key.startsWith('_')) continue;
            
            // Ignorer les champs null, undefined ou vides
            if (value !== null && value !== undefined && value !== '') {
                cleanedData[key] = value;
            }
        }

        console.log('[DEBUG SERVICE UPDATE] Données filtrées (sans null):', cleanedData);

        if (Object.keys(cleanedData).length === 0) {
            console.warn('[DEBUG SERVICE UPDATE] Aucune donnée à mettre à jour');
            throw new Error("Aucune donnée valide à mettre à jour");
        }

        return await sequelize.transaction(async (t) => {
            // Si is_featured est true, retirer le featured des autres
            if (cleanedData.is_featured) {
                console.log('[DEBUG SERVICE UPDATE] Unsetting previous featured');
                await ressourceRepository.unsetAllFeatured({ transaction: t });
            }

            console.log('[DEBUG SERVICE UPDATE] Mise à jour avec:', cleanedData);
            const updated = await ressourceRepository.update(id, cleanedData, { transaction: t });
            console.log('[DEBUG SERVICE UPDATE] Ressource mise à jour');

            // Supprimer les anciens fichiers APRÈS la mise à jour réussie
            if (oldUrl) {
                try {
                    const oldFilePath = path.join(__dirname, '..', oldUrl);
                    console.log('[DEBUG SERVICE UPDATE] Suppression ancien fichier:', oldFilePath);
                    
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log('[DEBUG SERVICE UPDATE] Ancien fichier supprimé');
                    }
                } catch (err) {
                    console.error('[ERROR SERVICE UPDATE] Erreur suppression ancien fichier:', err.message);
                }
            }

            if (oldImageCouverture) {
                try {
                    const oldCouverturePath = path.join(__dirname, '..', oldImageCouverture);
                    console.log('[DEBUG SERVICE UPDATE] Suppression ancienne couverture:', oldCouverturePath);
                    
                    if (fs.existsSync(oldCouverturePath)) {
                        fs.unlinkSync(oldCouverturePath);
                        console.log('[DEBUG SERVICE UPDATE] Ancienne couverture supprimée');
                    }
                } catch (err) {
                    console.error('[ERROR SERVICE UPDATE] Erreur suppression ancienne couverture:', err.message);
                }
            }

            return updated;
        });
    }

    async deleteRessource(id) {
        console.log('[DEBUG SERVICE DELETE] Suppression de la ressource ID:', id);
        
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) {
            console.error('[ERROR SERVICE DELETE] Ressource introuvable:', id);
            throw new Error("Ressource introuvable");
        }

        console.log('[DEBUG SERVICE DELETE] Ressource trouvée:', {
            id: ressource.id,
            url: ressource.url,
            image_couverture: ressource.image_couverture,
            projet_id: ressource.projet_id,
            evenement_id: ressource.evenement_id
        });

        return await sequelize.transaction(async (t) => {
            // Supprimer le fichier principal
            if (ressource.url) {
                try {
                    const filePath = path.join(__dirname, '..', ressource.url);
                    console.log('[DEBUG SERVICE DELETE] Chemin du fichier principal:', filePath);
                    
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log('[DEBUG SERVICE DELETE] Fichier principal supprimé du disque');
                    } else {
                        console.warn('[DEBUG SERVICE DELETE] Fichier principal non trouvé sur le disque:', filePath);
                    }
                } catch (err) {
                    console.error('[ERROR SERVICE DELETE] Erreur suppression fichier principal:', err.message);
                }
            }

            // Supprimer l'image de couverture si elle existe
            if (ressource.image_couverture) {
                try {
                    const couverturePath = path.join(__dirname, '..', ressource.image_couverture);
                    console.log('[DEBUG SERVICE DELETE] Chemin de l\'image de couverture:', couverturePath);
                    
                    if (fs.existsSync(couverturePath)) {
                        fs.unlinkSync(couverturePath);
                        console.log('[DEBUG SERVICE DELETE] Image de couverture supprimée du disque');
                    } else {
                        console.warn('[DEBUG SERVICE DELETE] Image de couverture non trouvée sur le disque:', couverturePath);
                    }
                } catch (err) {
                    console.error('[ERROR SERVICE DELETE] Erreur suppression image de couverture:', err.message);
                }
            }
            
            console.log('[DEBUG SERVICE DELETE] Suppression de la base de données');
            await ressourceRepository.delete(id, { transaction: t });
            console.log('[DEBUG SERVICE DELETE] Ressource supprimée de la base de données');
            return true;
        });
    }

    /**
     * Récupérer les ressources de l'association (projet_id IS NULL, evenement_id IS NULL)
     */
    async getAssociationRessources(filters = {}) {
        console.log('[DEBUG SERVICE] getAssociationRessources - Filters:', filters);
        const result = await ressourceRepository.findAssociationRessources(filters);
        console.log('[DEBUG SERVICE] Result:', { count: result.count, rows: result.rows.length });
        return result;
    }

    /**
     * Récupérer une ressource de l'association par ID
     */
    async getAssociationRessourceById(id) {
        console.log('[DEBUG SERVICE] getAssociationRessourceById - ID:', id);
        const ressource = await ressourceRepository.findAssociationRessourceById(id);
        console.log('[DEBUG SERVICE] Found ressource:', ressource);
        if (!ressource) throw new Error(`La ressource de l'association avec l'ID ${id} n'existe pas`);
        return ressource;
    }

    /**
     * Récupérer les documents de l'association pour le frontend public.
     * Formate la réponse selon la langue demandée.
     */
    async getDocumentsAssociation(lang, { limit, offset } = {}) {
        const [featured, result] = await Promise.all([
            ressourceRepository.findFeaturedDocument(),
            ressourceRepository.findDocumentsAssociation({ limit, offset })
        ]);

        return {
            featuredInsight: featured ? toDocumentDTO(featured, lang) : null,
            count:           result.count,
            rows:            result.rows.map(r => toDocumentDTO(r, lang))
        };
    }
}

module.exports = new RessourceService();
