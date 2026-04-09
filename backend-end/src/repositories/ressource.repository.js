const { Ressource, Projet } = require('../models');

class RessourceRepository {
    /**
     * Récupérer toutes les ressources avec filtres
     * @param {Object} filters - type, projet_id
     */
    async findAll(filters = {}) {
        const { type, projet_id, limit, offset } = filters;
        const where = {};

        if (type)       where.type       = type;
        if (projet_id)  where.projet_id  = projet_id;

        return await Ressource.findAndCountAll({
            where,
            order:  [['created_at', 'DESC']],
            limit:  limit  || 9,
            offset: offset || 0
        });
    }

    /**
     * Trouver une ressource par ID
     */
    async findById(id) {
        return await Ressource.findByPk(id);
    }

    /**
     * Créer une ressource
     */
    async create(data, options = {}) {
        return await Ressource.create(data, options);
    }

    /**
     * Mettre à jour les métadonnées d'une ressource
     */
    async update(id, data, options = {}) {
        const ressource = await Ressource.findByPk(id);
        if (!ressource) return null;
        return await ressource.update(data, options);
    }

    /**
     * Désactiver ou supprimer une ressource
     */
    async delete(id, options = {}) {
        const ressource = await Ressource.findByPk(id);
        if (!ressource) return false;
        await ressource.destroy(options);
        return true;
    }
}

module.exports = new RessourceRepository();
