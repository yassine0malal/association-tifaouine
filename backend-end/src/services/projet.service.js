const { sequelize } = require('../config/database');
const projetRepository = require('../repositories/projet.repository');

class ProjetService {
    /**
     * Récupérer tous les projets avec filtres (domaine, année)
     */
    async getAllProjets(filters = {}) {
        return await projetRepository.findAll(filters);
    }
    async getProjetById(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) {
            throw new Error(`Le projet avec l'ID ${id} n'existe pas`);
        }
        return projet;
    }

    /**
     * Création d'un projet avec transaction
     */
    async createProjet(data) {
        return await sequelize.transaction(async (t) => {
            const nvProjet = await projetRepository.create(data, { transaction: t });
            return nvProjet;
        });
    }

    /**
     * Mise à jour d'un projet avec transaction
     */
    async updateProjet(id, data) {
        const projet = await projetRepository.findById(id);
        if (!projet) {
            throw new Error("Projet introuvable pour la mise à jour");
        }

        return await sequelize.transaction(async (t) => {
            const misAjour = await projetRepository.update(id, data, { transaction: t });
            return misAjour;
        });
    }

    /**
     * Suppression d' un projet avec transaction
     */
    async deleteProjet(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) {
            throw new Error("Suppression impossible, ce projet n'existe pas");
        }

        return await sequelize.transaction(async (t) => {
            await projetRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new ProjetService();
