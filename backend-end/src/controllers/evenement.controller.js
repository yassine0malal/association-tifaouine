const evenementService = require('../services/evenement.service');
const { Evenement, Domaine, Ressource } = require('../models');
const { Op } = require('sequelize');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toEvenementListDTO, toEvenementDetailDTO } = require('../dto/evenement.dto');

class EvenementController {
    /**
     * @route   GET /api/evenements
     */
    async getAll(req, res) {
        try {
            const { domaine_id, projet_id, annee } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await evenementService.getAllEvenements({ domaine_id, projet_id, annee, limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des événements", error: error.message });
        }
    }

    /**
     * @route   GET /api/evenements/:id
     */
    async getById(req, res) {
        try {
            const eve = await evenementService.getEvenementById(req.params.id);
            return res.status(200).json({ success: true, data: eve });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    // ─── Méthodes avec langue (DTO frontend) ─────────────────────────────────

    /**
     * @route   GET /api/:lang/evenements
     * @desc    Liste paginée des événements avec DTO selon la langue
     * @query   domaine_id, projet_id, page, limit
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const { domaine_id, projet_id } = req.query;
            const { page, limit, offset } = req.pagination;

            const where = {};
            if (domaine_id) where.domaine_id = domaine_id;
            if (projet_id)  where.projet_id  = projet_id;

            const result = await Evenement.findAndCountAll({
                where,
                include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
                order:   [['date_debut', 'DESC']],
                limit,
                offset
            });

            const rows = result.rows.map(e => toEvenementListDTO(e, lang));
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse({ count: result.count, rows }, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/evenements/:id
     * @desc    Détail d'un événement avec événements liés, communs et images
     */
    async getByIdAndLang(req, res) {
        try {
            const { lang } = req;
            const eve = await Evenement.findByPk(req.params.id, {
                include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }]
            });

            if (!eve) {
                return res.status(404).json({ success: false, message: 'Événement introuvable.' });
            }

            const relatedEvents = eve.projet_id
                ? await Evenement.findAll({
                    where: { projet_id: eve.projet_id, id: { [Op.ne]: eve.id } },
                    limit: 3,
                    order: [['date_debut', 'DESC']]
                })
                : [];

            const commonEvents = await Evenement.findAll({
                where:   { domaine_id: eve.domaine_id, id: { [Op.ne]: eve.id } },
                include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
                limit:   3,
                order:   [['date_debut', 'DESC']]
            });

            const images = eve.projet_id
                ? await Ressource.findAll({
                    where: { projet_id: eve.projet_id, type: 'photo' },
                    order: [['created_at', 'DESC']]
                })
                : [];

            return res.status(200).json({
                success: true,
                data: toEvenementDetailDTO(eve, lang, relatedEvents, commonEvents, images)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // ─── CRUD Admin ───────────────────────────────────────────────────────────

    /**
     * @route   POST /api/evenements
     */
    async create(req, res) {
        try {
            const nvEve = await evenementService.createEvenement(req.body);
            return res.status(201).json({ success: true, message: "Événement créé avec succès", data: nvEve });
        } catch (error) {
            return res.status(400).json({ success: false, message: "Erreur lors de la création de l'événement", error: error.message });
        }
    }

    /**
     * @route   PUT /api/evenements/:id
     */
    async update(req, res) {
        try {
            const misAjour = await evenementService.updateEvenement(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Événement mis à jour avec succès", data: misAjour });
        } catch (error) {
            const status = error.message.includes('introuvable') ? 404 : 400;
            return res.status(status).json({ success: false, message: "Erreur lors de la mise à jour de l'événement", error: error.message });
        }
    }

    /**
     * @route   DELETE /api/evenements/:id
     */
    async delete(req, res) {
        try {
            await evenementService.deleteEvenement(req.params.id);
            return res.status(200).json({ success: true, message: "Événement supprimé avec succès" });
        } catch (error) {
            return res.status(404).json({ success: false, message: "Erreur lors de la suppression de l'événement", error: error.message });
        }
    }
}

module.exports = new EvenementController();
