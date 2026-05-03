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
     * Créer plusieurs ressources en une seule opération (bulk)
     */
    async bulkCreate(dataArray, options = {}) {
        return await Ressource.bulkCreate(dataArray, { returning: true, ...options });
    }

    /**
     * Créer une ressource
     */
    async create(data, options = {}) {
        console.log('[DEBUG REPO CREATE] Création avec données:', {
            type: data.type,
            projet_id: data.projet_id,
            evenement_id: data.evenement_id,
            nom_original: data.nom_original
        });
        const ressource = await Ressource.create(data, options);
        console.log('[DEBUG REPO CREATE] Ressource créée:', {
            id: ressource.id,
            projet_id: ressource.projet_id,
            evenement_id: ressource.evenement_id
        });
        return ressource;
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
        console.log('[DEBUG REPO DELETE] Suppression de la ressource ID:', id);
        
        const ressource = await Ressource.findByPk(id);
        if (!ressource) {
            console.error('[ERROR REPO DELETE] Ressource introuvable:', id);
            return false;
        }
        
        console.log('[DEBUG REPO DELETE] Ressource trouvée, suppression en cours');
        await ressource.destroy(options);
        console.log('[DEBUG REPO DELETE] Ressource supprimée');
        return true;
    }

    /**
     * Récupérer les ressources de l'association (projet_id IS NULL, evenement_id IS NULL)
     * @param {Object} filters - type, limit, offset
     */
    async findAssociationRessources(filters = {}) {
        console.log('[DEBUG REPO] findAssociationRessources - Filters:', filters);
        
        const { type, limit, offset } = filters;
        const where = {
            projet_id:    null,
            evenement_id: null
        };

        if (type) where.type = type;

        console.log('[DEBUG REPO] Where clause:', where);

        const result = await Ressource.findAndCountAll({
            where,
            order:  [['created_at', 'DESC']],
            limit:  limit  || 9,
            offset: offset || 0
        });

        console.log('[DEBUG REPO] Query result:', { count: result.count, rows: result.rows.length });
        return result;
    }

    /**
     * Récupérer une ressource de l'association par ID
     */
    async findAssociationRessourceById(id) {
        console.log('[DEBUG REPO] findAssociationRessourceById - ID:', id);
        
        const where = {
            id,
            projet_id:    null,
            evenement_id: null
        };

        console.log('[DEBUG REPO] Where clause:', where);

        const ressource = await Ressource.findOne({ where });
        
        console.log('[DEBUG REPO] Found ressource:', ressource ? 'YES' : 'NO');
        return ressource;
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
            limit:  limit  || 12,
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
