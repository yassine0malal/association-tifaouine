const { sequelize } = require('../config/database');
const evenementRepository = require('../repositories/evenement.repository');

class EvenementService {
    /**
     * Récupérer tous les événements avec filtres
     */
    async getAllEvenements(filters = {}) {
        return await evenementRepository.findAll(filters);
    }
    async getEvenementById(id) {
        const eve = await evenementRepository.findById(id);
        if (!eve) {
            throw new Error(`L'événement avec l'ID ${id} n'existe pas`);
        }
        return eve;
    }

    /**
     * Création d'un événement avec transaction
     */
    async createEvenement(data) {
        return await sequelize.transaction(async (t) => {
            const nvEve = await evenementRepository.create(data, { transaction: t });
            return nvEve;
        });
    }

    /**
     * Mise à jour d'un événement avec transaction
     */
    async updateEvenement(id, data) {
        const eve = await evenementRepository.findById(id);
        if (!eve) {
            throw new Error("Événement introuvable pour la mise à jour");
        }

        return await sequelize.transaction(async (t) => {
            const misAjour = await evenementRepository.update(id, data, { transaction: t });
            return misAjour;
        });
    }

    /**
     * Suppression d'un événement avec transaction
     */
    async deleteEvenement(id) {
        const eve = await evenementRepository.findById(id);
        if (!eve) {
            throw new Error("Suppression impossible, cet événement n'existe pas");
        }

        return await sequelize.transaction(async (t) => {
            await evenementRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new EvenementService();
