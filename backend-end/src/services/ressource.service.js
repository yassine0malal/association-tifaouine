const { sequelize } = require('../config/database');
const ressourceRepository = require('../repositories/ressource.repository');
const fs = require('fs');
const path = require('path');

class RessourceService {
    /**
     * Récupérer toutes les ressources avec filtres
     */
    async getAllRessources(filters = {}) {
        return await ressourceRepository.findAll(filters);
    }

    /**
     * Récupérer une ressource par ID
     */
    async getRessourceById(id) {
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) {
            throw new Error(`La ressource avec l'ID ${id} n'existe pas`);
        }
        return ressource;
    }

    /**
     * Création d'une ressource (DB)
     */
    async createRessource(data) {
        return await sequelize.transaction(async (t) => {
            return await ressourceRepository.create(data, { transaction: t });
        });
    }

    /**
     * Mise à jour des métadonnées
     */
    async updateRessource(id, updateData) {
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) throw new Error("Ressource introuvable");

        return await sequelize.transaction(async (t) => {
            return await ressourceRepository.update(id, updateData, { transaction: t });
        });
    }

    /**
     * Suppression d'une ressource (DB + Disque)
     */
    async deleteRessource(id) {
        const ressource = await ressourceRepository.findById(id);
        if (!ressource) throw new Error("Ressource introuvable");

        return await sequelize.transaction(async (t) => {
            // 1. Supprimer le fichier physique
            if (ressource.url) {
                try {
                    const filePath = path.join(__dirname, '..', ressource.url);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`Fichier supprimé : ${filePath}`);
                    }
                } catch (err) {
                    console.error("Erreur lors de la suppression du fichier physique :", err.message);
                    // On continue la suppression en DB même si le fichier physique échoue
                }
            }

            // 2. Supprimer de la base de données
            await ressourceRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new RessourceService();
