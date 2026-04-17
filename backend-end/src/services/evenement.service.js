const { sequelize } = require('../config/database');
const evenementRepository = require('../repositories/evenement.repository');

class EvenementService {
    async getAllEvenements(filters = {}) {
        return await evenementRepository.findAll(filters);
    }

    async getEvenementById(id) {
        const eve = await evenementRepository.findById(id);
        if (!eve) throw new Error(`L'événement avec l'ID ${id} n'existe pas`);
        return eve;
    }

    /**
     * Création d'un événement avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[]
     */
    async createEvenement(data) {
        let { partenariat_ids = [], ...evenementData } = data;
        if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
        partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));

        return await sequelize.transaction(async (t) => {
            const nvEve = await evenementRepository.create(evenementData, { transaction: t });
            if (partenariat_ids.length > 0) {
                await nvEve.setPartenariats(partenariat_ids, { transaction: t });
            }
            return nvEve;
        });
    }

    /**
     * Mise à jour d'un événement avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[] (remplace toute la liste si fourni)
     */
    async updateEvenement(id, data) {
        const eve = await evenementRepository.findById(id);
        if (!eve) throw new Error("Événement introuvable pour la mise à jour");

        let { partenariat_ids, ...evenementData } = data;
        if (partenariat_ids !== undefined) {
            if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
            partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));
        }
        return await sequelize.transaction(async (t) => {
            const misAjour = await evenementRepository.update(id, evenementData, { transaction: t });
            if (partenariat_ids !== undefined) {
                await misAjour.setPartenariats(partenariat_ids, { transaction: t });
            }
            return misAjour;
        });
    }

    async deleteEvenement(id) {
        const eve = await evenementRepository.findById(id);
        if (!eve) throw new Error("Suppression impossible, cet événement n'existe pas");
        return await sequelize.transaction(async (t) => {
            await evenementRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new EvenementService();
