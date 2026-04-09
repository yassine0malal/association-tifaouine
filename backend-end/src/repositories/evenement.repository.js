const { Evenement, Domaine, Projet } = require('../models');
const { Op } = require('sequelize');

class EvenementRepository {
    /**
     * Récupérer tous les événements avec filtres
     * @param {Object} filters - domaine_id, projet_id, annee
     */
    async findAll(filters = {}) {
        const { domaine_id, projet_id, annee, limit, offset } = filters;
        const where = {};

        if (domaine_id) where.domaine_id = domaine_id;
        if (projet_id)  where.projet_id  = projet_id;
        if (annee) {
            where.date_debut = {
                [Op.between]: [`${annee}-01-01`, `${annee}-12-31`]
            };
        }

        return await Evenement.findAndCountAll({
            where,
            order:  [['date_debut', 'DESC']],
            limit:  limit  || 9,
            offset: offset || 0
        });
    }

    /**
     * Trouver un événement par son ID
     */
    async findById(id) {
        return await Evenement.findByPk(id);
    }

    /**
     * Création d'un événement
     */
    async create(data, options = {}) {
        return await Evenement.create(data, options);
    }

    /**
     * Mise à jour d'un événement
     */
    async update(id, data, options = {}) {
        const eve = await Evenement.findByPk(id);
        if (!eve) return null;
        return await eve.update(data, options);
    }

    /**
     * Suppression d'un événement
     */
    async delete(id, options = {}) {
        const eve = await Evenement.findByPk(id);
        if (!eve) return false;
        await eve.destroy(options);
        return true;
    }
}

module.exports = new EvenementRepository();
