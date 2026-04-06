const { Partenariat } = require('../models');

class PartenariatRepository {
    /**
     * Récupérer tous les partenariats
     */
    async findAll() {
        return await Partenariat.findAll({
            order: [['created_at', 'DESC']]
        });
    }

    /**
     * Trouver un partenariat par son ID
     * @param {number} id 
     */
    async findById(id) {
        return await Partenariat.findByPk(id);
    }

    /**
     * Chercher un partenariat par son nom (pour éviter les doublons)
     * @param {string} nom 
     */
    async findByName(nom) {
        const { Op } = require('sequelize');
        return await Partenariat.findOne({
            where: {
                nom: { [Op.like]: `%${nom}%` }
            }
        });
    }

    /**
     * Création d'un partenariat
     * @param {Object} data 
     * @param {Object} options 
     */
    async create(data, options = {}) {
        return await Partenariat.create(data, options);
    }

    /**
     * Mise à jour d'un partenariat
     * @param {number} id 
     * @param {Object} data 
     * @param {Object} options 
     */
    async update(id, data, options = {}) {
        const partenariat = await Partenariat.findByPk(id);
        if (!partenariat) return null;
        return await partenariat.update(data, options);
    }

    /**
     * Suppression d'un partenariat
     * @param {number} id 
     * @param {Object} options 
     */
    async delete(id, options = {}) {
        const partenariat = await Partenariat.findByPk(id);
        if (!partenariat) return false;
        await partenariat.destroy(options);
        return true;
    }
}

module.exports = new PartenariatRepository();
