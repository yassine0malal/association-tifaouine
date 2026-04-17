const projetService = require('../services/projet.service');
const { Projet, Domaine, Ressource, Partenariat } = require('../models');
const { Op } = require('sequelize');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toProjetListDTO, toProjetDetailDTO } = require('../dto/projet.dto');
const fs = require('fs');
const path = require('path');

class ProjetController {
    /**
     * @route   GET /api/projets
     * @desc    Récupérer tous les projets avec filtres (domaine_id, annee)
     */
    async getAll(req, res) {
        try {
            const { domaine_id, annee } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await projetService.getAllProjets({ domaine_id, annee, limit, offset });
            return res.status(200).json({
                success: true,
                count:   result.count,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des projets", error: error.message });
        }
    }

    /**
     * @route   GET /api/projets/:id
     * @desc    Récupérer un projet spécifique par son ID
     */
    async getById(req, res) {
        try {
            const projet = await projetService.getProjetById(req.params.id);
            return res.status(200).json({
                success: true,
                data: projet
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // ─── Méthodes avec langue (DTO frontend) ─────────────────────────────────

    /**
     * @route   GET /api/:lang/projets
     * @desc    Liste paginée des projets avec DTO selon la langue
     * @query   domaine_id, statut, page, limit
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const { domaine_id, statut } = req.query;
            const { page, limit, offset } = req.pagination;

            const where = {};
            if (domaine_id) where.domaine_id = domaine_id;
            if (statut)     where.statut     = statut;

            const result = await Projet.findAndCountAll({
                where,
                include: [{ model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] }],
                order:   [['date_debut', 'DESC']],
                limit,
                offset
            });

            const rows = result.rows.map(p => toProjetListDTO(p.toJSON(), lang));
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse({ count: result.count, rows }, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/projets/:id
     * @desc    Détail d'un projet avec DTO selon la langue
     */
    async getByIdAndLang(req, res) {
        try {
            const { lang } = req;
            const projet = await Projet.findByPk(req.params.id, {
                include: [
                    { model: Domaine, attributes: ['id', 'nom_fr', 'nom_ar', 'nom_en'] },
                    {
                        model: Partenariat,
                        as: 'Partenariats',
                        attributes: ['nom'],
                        through: { attributes: [] }
                    }
                ]
            });

            if (!projet) {
                return res.status(404).json({ success: false, message: 'Projet introuvable.' });
            }

            return res.status(200).json({
                success: true,
                data: toProjetDetailDTO(projet.toJSON(), lang)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/projets/:id/images
     * @desc    Photos d'un projet paginées avec DTO selon la langue
     */
    async getImagesByLang(req, res) {
        try {
            const { lang } = req;
            const { page, limit, offset } = req.pagination;

            const projet = await Projet.findByPk(req.params.id);
            if (!projet) {
                return res.status(404).json({ success: false, message: 'Projet introuvable.' });
            }

            const result = await Ressource.findAndCountAll({
                where:  { projet_id: req.params.id, type: 'photo' },
                order:  [['created_at', 'DESC']],
                limit,
                offset
            });

            const totalPages = Math.ceil(result.count / limit);

            return res.status(200).json({
                success:     true,
                images:      result.rows.map(img => ({
                    id:  img.id,
                    src: img.url,
                    alt: img[`titre_${lang}`] || img.titre_fr || ''
                })),
                currentPage:  page,
                totalPages,
                nextPage:     page < totalPages ? page + 1 : null,
                prevPage:     page > 1 ? page - 1 : 0,
                itemsPerPage: limit
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // ─── CRUD Admin ───────────────────────────────────────────────────────────

    /**
     * @route   POST /api/projets
     * @desc    Créer un nouveau projet (Admin seulement)
     */
    async create(req, res) {
        try {
            if (req.file && req.uploadedUrl) {
                req.body.image_principale = `${req.uploadedUrl}/${req.file.filename}`;
            }

            const nvProjet = await projetService.createProjet(req.body);
            return res.status(201).json({
                success: true,
                message: "Projet créé avec succès",
                data: nvProjet
            });
        } catch (error) {
            // Supprimer le fichier uploadé si la création a échoué
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
            return res.status(400).json({
                success: false,
                message: "Erreur lors de la création du projet",
                error: error.message
            });
        }
    }

    /**
     * @route   PUT /api/projets/:id
     * @desc    Mettre à jour un projet (Admin seulement)
     */
    async update(req, res) {
        try {
            if (req.file && req.uploadedUrl) {
                req.body.image_principale = `${req.uploadedUrl}/${req.file.filename}`;
            }

            const misAjour = await projetService.updateProjet(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: "Projet mis à jour avec succès",
                data: misAjour
            });
        } catch (error) {
            // Supprimer le fichier uploadé si la mise à jour a échoué
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
            return res.status(error.message.includes('introuvable') ? 404 : 400).json({
                success: false,
                message: "Erreur lors de la mise à jour du projet",
                error: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/projets/:id
     * @desc    Supprimer un projet (Admin seulement)
     */
    async delete(req, res) {
        try {
            await projetService.deleteProjet(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Projet supprimé avec succès"
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: "Erreur lors de la suppression du projet",
                error: error.message
            });
        }
    }
}

module.exports = new ProjetController();
