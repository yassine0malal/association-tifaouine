const { Domaine, Projet } = require('../models');

class DomaineRepository {
    async findAll(filters = {}) {
        const { limit, offset } = filters;
        return await Domaine.findAndCountAll({
            order:  [['created_at', 'ASC']],
            limit:  limit  || 9,
            offset: offset || 0
        });
    }

    // trouve un domaine par id
    async findById(id) {
        return await Domaine.findByPk(id);
    }

    // cherche un domaine par son nom (pour eviter les doublons dans la bd)
    async findByName(nom) {
        const { Op } = require('sequelize');
        return await Domaine.findOne({
            where: {
                nom_fr: { [Op.like]: `%${nom}%` }
            }
        });
    }

    // requete de creation 
    async create(data, options = {}) {
        return await Domaine.create(data, options);
    }
    
    // modifier le domaine
    async update(id, data, options = {}) {
        const domaine = await Domaine.findByPk(id);
        // verifier si il existe
        if (!domaine) return null;
        return await domaine.update(data, options);
    }

    // supprimer le domaine
    async delete(id, options = {}) {
        const domaine = await Domaine.findByPk(id);
        if (!domaine) return false;
        await domaine.destroy(options);
        return true;
    }
}

// export de l'instance
module.exports = new DomaineRepository();
