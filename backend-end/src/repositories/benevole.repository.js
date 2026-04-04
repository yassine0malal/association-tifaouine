const { Utilisateur, benevole } = require('../models');

class BenevoleRepository {
    /**
     * @desc    Récupérer tous les bénévoles avec leurs infos de base
     */
    async findAll() {
        return await Utilisateur.findAll({
            where: { type: 'benevole' },
            include: [{
                model: benevole,
                required: true
            }]
        });
    }

    /**
     * @desc    Récupérer un bénévole par son ID utilisateur
     */
    async findById(id) {
        return await Utilisateur.findOne({
            where: { id, type: 'benevole' },
            include: [{
                model: benevole,
                required: true
            }]
        });
    }

    /**
     * @desc    Vérifier si un email existe déjà pour un bénévole
     */
    async findByEmail(email) {
        return await Utilisateur.findOne({
            where: { email, type: 'benevole' },
            include: [{ model: benevole, required: true }]
        });
    }

    /**
     * @desc    Trouver un bénévole par son nom
     */
    async findByName(nom) {
        const { Op } = require('sequelize');
        return await Utilisateur.findOne({
            where: {
                nom: { [Op.like]: `%${nom}%` },
                type: 'benevole'
            },
            include: [{ model: benevole, required: true }]
        });
    }
}

module.exports = new BenevoleRepository();
