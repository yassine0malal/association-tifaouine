const { sequelize } = require('../config/database');
const projetRepository = require('../repositories/projet.repository');

class ProjetService {
    async getAllProjets(filters = {}) {
        return await projetRepository.findAll(filters);
    }

    async getProjetById(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error(`Le projet avec l'ID ${id} n'existe pas`);
        return projet;
    }

    /**
     * Création d'un projet avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[]
     */
    async createProjet(data) {
        let { partenariat_ids = [], ...projetData } = data;
        // Normaliser : string "1" ou nombre 1 → tableau [1]
        if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
        partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));

        return await sequelize.transaction(async (t) => {
            const nvProjet = await projetRepository.create(projetData, { transaction: t });
            if (partenariat_ids.length > 0) {
                await nvProjet.setPartenariats(partenariat_ids, { transaction: t });
            }
            return nvProjet;
        });
    }

    /**
     * Mise à jour d'un projet avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[] (remplace toute la liste si fourni)
     */
    async updateProjet(id, data) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Projet introuvable pour la mise à jour");

        let { partenariat_ids, ...projetData } = data;
        if (partenariat_ids !== undefined) {
            if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
            partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));
        }
        return await sequelize.transaction(async (t) => {
            const misAjour = await projetRepository.update(id, projetData, { transaction: t });
            // Si partenariat_ids est fourni (même vide []), on remplace la liste
            if (partenariat_ids !== undefined) {
                await misAjour.setPartenariats(partenariat_ids, { transaction: t });
            }
            return misAjour;
        });
    }

    async deleteProjet(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Suppression impossible, ce projet n'existe pas");
        return await sequelize.transaction(async (t) => {
            await projetRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new ProjetService();
