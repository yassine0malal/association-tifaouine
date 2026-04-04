const { Utilisateur, membre } = require('../models');

class MembreRepository {
    /**
     * @desc    Récupérer tous les membres avec leurs infos de base
     */
    async findAll() {
        return await Utilisateur.findAll({
            where: { type: 'membre' },
            include: [{
                model: membre,
                required: true
            }]
        });
    }

    /**
     * @desc    Récupérer un membre par son ID utilisateur
     */
    async findById(id) {
        return await Utilisateur.findOne({
            where: { id, type: 'membre' },
            include: [{
                model: membre,
                required: true
            }]
        });
    }

    /**
     * @desc    Vérifier si un email existe déjà
     */
    async findByEmail(email) {
        return await Utilisateur.findOne({
            where: { email, type: 'membre' },
            include: [{ model: membre, required: true }]
        });
    }

    /**
     * @desc    Trouver un membre par son nom
     */
    async findByName(nom) {
        const { Op } = require('sequelize');
        return await Utilisateur.findOne({
            where: {
                nom: { [Op.like]: `%${nom}%` },
                type: 'membre'
            },
            include: [{ model: membre, required: true }]
        });
    }
}

module.exports = new MembreRepository();
