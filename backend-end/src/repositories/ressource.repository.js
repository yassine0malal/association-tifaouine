const { Ressource, Projet } = require('../models');
const { Op } = require('sequelize');

class RessourceRepository {
    /**
     * Récupérer toutes les ressources avec filtres
     * @param {Object} filters - type, projet_id, evenement_id
     */
    async findAll(filters = {}) {
        const { type, projet_id, evenement_id, limit, offset } = filters;
        const where = {};

        if (type)         where.type         = type;
        if (projet_id)    where.projet_id    = projet_id;
        if (evenement_id) where.evenement_id = evenement_id;

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
     * Vérifie si un fichier avec le même nom_original existe déjà
     * pour le même projet ou événement.
     */
    async findDuplicate(nomOriginal, projetId, evenementId) {
        const { Op } = require('sequelize');
        const where = { nom_original: nomOriginal };
        if (projetId)    where.projet_id    = projetId;
        else if (evenementId) where.evenement_id = evenementId;
        else where[Op.and] = [{ projet_id: null }, { evenement_id: null }];
        return await Ressource.findOne({ where });
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

    /**
     * Récupérer les documents de l'association (projet_id IS NULL, evenement_id IS NULL)
     * types : document, rapport, guide — exclut le featured
     */
    async findDocumentsAssociation({ limit, offset } = {}) {
        return await Ressource.findAndCountAll({
            where: {
                projet_id:    null,
                evenement_id: null,
                type: { [Op.in]: ['document', 'rapport', 'guide'] }
            },
            order:  [['is_featured', 'DESC'], ['created_at', 'DESC']],
            limit:  limit  || 9,
            offset: offset || 0
        });
    }

    /**
     * Récupérer le document featured de l'association
     */
    async findFeaturedDocument() {
        return await Ressource.findOne({
            where: {
                projet_id:    null,
                evenement_id: null,
                is_featured:  true,
                type: { [Op.in]: ['document', 'rapport', 'guide'] }
            }
        });
    }

    /**
     * Remettre tous les documents de l'association à is_featured = false
     */
    async unsetAllFeatured(options = {}) {
        await Ressource.update(
            { is_featured: false },
            {
                where: {
                    projet_id:    null,
                    evenement_id: null,
                    is_featured:  true
                },
                ...options
            }
        );
    }
}

module.exports = new RessourceRepository();
