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
        if (data.nom_original) {
            const doublon = await ressourceRepository.findDuplicate(
                data.nom_original,
                data.projet_id    || null,
                data.evenement_id || null
            );
            if (doublon) {
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
            } catch (_) {}
        }
        if (data.nom_original && !data.file_type) {
            const ext = path.extname(data.nom_original).toLowerCase().replace('.', '');
            if (ext) data.file_type = ext;
        }

        // Si is_featured = true → retirer le featured actuel (un seul à la fois)
        return await sequelize.transaction(async (t) => {
            if (data.is_featured) {
                await ressourceRepository.unsetAllFeatured({ transaction: t });
            }
            return await ressourceRepository.create(data, { transaction: t });
        });
    }

    async updateRessource(id, updateData) {
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) throw new Error("Ressource introuvable");
        return await sequelize.transaction(async (t) => {
            if (updateData.is_featured) {
                await ressourceRepository.unsetAllFeatured({ transaction: t });
            }
            return await ressourceRepository.update(id, updateData, { transaction: t });
        });
    }

    async deleteRessource(id) {
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) throw new Error("Ressource introuvable");

        return await sequelize.transaction(async (t) => {
            if (ressource.url) {
                try {
                    const filePath = path.join(__dirname, '..', ressource.url);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch (err) {
                    console.error("Erreur suppression fichier physique :", err.message);
                }
            }
            await ressourceRepository.delete(id, { transaction: t });
            return true;
        });
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
