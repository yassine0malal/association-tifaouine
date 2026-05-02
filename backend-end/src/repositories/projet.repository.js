const { Projet, Domaine, Partenariat, Ressource } = require('../models');
const { Op } = require('sequelize');

class ProjetRepository {
    async findAll(filters = {}) {
        const { domaine_id, annee, limit, offset ,statut } = filters;
        const where = {};
        if (domaine_id) where.domaine_id = domaine_id;
        if (annee) where.date_debut = { [Op.between]: [`${annee}-01-01`, `${annee}-12-31`] };
        return await Projet.findAndCountAll({
            where, order: [['date_debut', 'DESC']], limit: limit || 9, offset: offset || 0
        });
    }

    async findAllWithDomaine(filters = {}) {
        const { domaine_id, statut, limit, offset } = filters;
        const where = {};
        if (domaine_id) where.domaine_id = domaine_id;
        if (statut) where.statut = statut;
        return await Projet.findAndCountAll({
            where,
            include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
            order: [['date_debut', 'DESC']],
            limit: limit || 9,
            offset: offset || 0
        });
    }
    async findAllWithDomaineForDon(filters = {}) {
        const { domaine_id, statut } = filters;
        const where = {};
        if (domaine_id) where.domaine_id = domaine_id;
        if (statut) where.statut = statut;
        const rows = await Projet.findAll({
            where,
            include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
            order: [['date_debut', 'DESC']],
        });
        return { rows, count: rows.length };
    }

    async findById(id) {
        return await Projet.findByPk(id);
    }

    async findByIdWithDetails(id) {
        return await Projet.findByPk(id, {
            include: [
                { model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] },
                { model: Partenariat, as: 'Partenariats', attributes: ['nom'], through: { attributes: [] } }
            ]
        });
    }

    async findImages(projetId, filters = {}) {
        const { limit, offset } = filters;
        return await Ressource.findAndCountAll({
            where: { projet_id: projetId, type: 'photo' },
            order: [['created_at', 'DESC']],
            limit: limit || 9,
            offset: offset || 0
        });
    }

    async create(data, options = {}) {
        return await Projet.create(data, options);
    }

    async update(id, data, options = {}) {
        const projet = await Projet.findByPk(id);
        if (!projet) return null;
        return await projet.update(data, options);
    }

    async delete(id, options = {}) {
        const projet = await Projet.findByPk(id);
        if (!projet) return false;
        await projet.destroy(options);
        return true;
    }
}

module.exports = new ProjetRepository();
