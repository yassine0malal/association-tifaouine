const { Projet, Domaine } = require('../models');
const { Op } = require('sequelize');

class ProjetRepository {
    /**
     * Récupérer tous les projets avec filtres optionnels
     * @param {Object} filters - domaine_id, annee
     */
    async findAll(filters = {}) {
        const { domaine_id, annee, limit, offset } = filters;
        const where = {};

        if (domaine_id) {
            where.domaine_id = domaine_id;
        }

        if (annee) {
            where.date_debut = {
                [Op.between]: [`${annee}-01-01`, `${annee}-12-31`]
            };
        }

        return await Projet.findAndCountAll({
            where,
            order:  [['date_debut', 'DESC']],
            limit:  limit  || 10,
            offset: offset || 0
        });
    }

    /**
     * Trouver un projet par son ID
     * @param {number} id 
     */
    async findById(id) {
        return await Projet.findByPk(id);
    }

    /**
     * Création d'un projet
     */
    async create(data, options = {}) {
        return await Projet.create(data, options);
    }

    /**
     * Mise à jour d'un projet
     */
    async update(id, data, options = {}) {
        const projet = await Projet.findByPk(id);
        if (!projet) return null;
        return await projet.update(data, options);
    }

    /**
     * Suppression d'un projet
     */
    async delete(id, options = {}) {
        const projet = await Projet.findByPk(id);
        if (!projet) return false;
        await projet.destroy(options);
        return true;
    }
}

module.exports = new ProjetRepository();
