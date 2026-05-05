const { Don, DonFinancier, DonMateriel, Projet } = require('../models');
const { Op } = require('sequelize');

class DonRepository {

    /**
     * Inclure la sous-entité selon le type_don
     */
    _buildIncludes() {
        return [
            { model: DonFinancier, required: false },
            { model: DonMateriel,  required: false },
            { model: Projet,       required: false, attributes: ['id', 'titre_fr', 'titre_ar', 'titre_en'] }
        ];
    }

    /**
     * Récupérer tous les dons avec filtres optionnels
     * @param {Object} filters - type_don, statut, type_destination, projet_id
     */
    async findAll(filters = {}) {
        const { type_don, statut, type_destination, projet_id, limit, offset, search } = filters;
        const where = {};

        if (type_don)         where.type_don         = type_don;
        if (statut)           where.statut           = statut;
        if (type_destination) where.type_destination = type_destination;
        if (projet_id)        where.projet_id        = projet_id;

        if (search) {
            where[Op.or] = [
                { nom_complet: { [Op.like]: `%${search}%` } },
                { email:       { [Op.like]: `%${search}%` } }
            ];
        }

        return await Don.findAndCountAll({
            where,
            include: this._buildIncludes(),
            order:   [['date_reception', 'DESC']],
            limit:   limit  ? parseInt(limit)  : 9,
            offset:  offset ? parseInt(offset) : 0
        });
    }

    /**
     * Trouver un don par son ID (avec sous-entité)
     */
    async findById(id, options = {}) {
        return await Don.findByPk(id, {
            ...options,
            include: this._buildIncludes()
        });
    }

    /**
     * Créer le don parent
     */
    async createDon(data, options = {}) {
        return await Don.create(data, options);
    }

    
    /**
     * Créer un don financier lié
     */
    async createDonFinancier(data, options = {}) {
        return await DonFinancier.create(data, options);
    }

    /**
     * Créer un don matériel lié
     */
    async createDonMateriel(data, options = {}) {
        return await DonMateriel.create(data, options);
    }

    /**
     * Mettre à jour le statut d'un don
     */
    async updateStatut(id, statut, options = {}) {
        const don = await Don.findByPk(id);
        if (!don) return null;
        return await don.update({ statut }, options);
    }

    /**
     * Supprimer un don (cascade sur DonFinancier/DonMateriel via associations)
     */
    async delete(id, options = {}) {
        const don = await Don.findByPk(id);
        if (!don) return false;
        await don.destroy(options);
        return true;
    }
}

module.exports = new DonRepository();
