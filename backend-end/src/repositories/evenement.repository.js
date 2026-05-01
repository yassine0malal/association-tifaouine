const { Evenement, Domaine, Projet, Partenariat, Ressource } = require('../models');
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
     * Récupérer tous les événements avec Domaine inclus (pour le DTO frontend)
     */
    async findAllWithDomaine(filters = {}) {
        const { domaine_id, projet_id, limit, offset } = filters;
        const where = {};
        if (domaine_id) where.domaine_id = domaine_id;
        if (projet_id)  where.projet_id  = projet_id;

        return await Evenement.findAndCountAll({
            where,
            include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
            order:   [['date_debut', 'DESC']],
            limit:   limit  || 9,
            offset:  offset || 0
        });
    }

    /**
     * Trouver un événement par son ID avec Domaine et Partenariats
     */
    async findById(id) {
        return await Evenement.findByPk(id);
    }

    /**
     * Trouver un événement par ID avec toutes ses associations pour le détail frontend
     */
    async findByIdWithDetails(id) {
        return await Evenement.findByPk(id, {
            include: [
                { model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] },
                {
                    model: Partenariat,
                    as: 'Partenariats',
                    attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'],
                    through: { attributes: [] }
                }
            ]
        });
    }

    /**
     * Événements du même domaine (related)
     */
    async findByDomaine(domaineId, excludeId, limit = 4) {
        return await Evenement.findAll({
            where:   { domaine_id: domaineId, id: { [Op.ne]: excludeId } },
            include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
            order:   [['date_debut', 'DESC']],
            limit
        });
    }

    /**
     * Derniers événements ajoutés en DB (lasted)
     */
    async findLasted(excludeId, limit = 4) {
        return await Evenement.findAll({
            where:   { id: { [Op.ne]: excludeId } },
            include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
            order:   [['created_at', 'DESC']],
            limit
        });
    }

    /**
     * Photos liées à un événement
     */
    async findImages(evenementId) {
        return await Ressource.findAll({
            where: { evenement_id: evenementId, type: 'photo' },
            order: [['created_at', 'DESC']]
        });
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
