const benevoleService = require('../services/benevole.service');
const { Utilisateur, benevole } = require('../models');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toBenevoleListDTO } = require('../dto/benevole.dto');

class BenevoleController {
    /**
     * @route   POST /api/benevoles
     * @desc    Créer un ou plusieurs bénévoles
     * @access  Private (Admin)
     */
    async create(req, res) {
        try {
            if (req.file) {
                req.body.photo_profile = `/data/benevoles/${req.file.filename}`;
            }
            const result = await benevoleService.createBenevoles(req.body);
            return res.status(201).json({
                success: true,
                message: result.length > 1 ? "Bénévoles créés avec succès." : "Bénévole créé avec succès.",
                data: result
            });
        } catch (error) {
            console.error("Erreur creation benevole controller : ", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/benevoles
     * @desc    Récupérer tous les bénévoles
     * @access  Private (Admin)
     */
    async getAll(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const result = await benevoleService.getAllBenevoles({ limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Impossible de récupérer les bénévoles." });
        }
    }

    /**
     * @route   GET /api/:lang/benevoles
     * @desc    Liste des bénévoles avec DTO (langue non discriminante ici)
     */
    async getAllByLang(req, res) {
        try {
            const { page, limit, offset } = req.pagination;

            const result = await Utilisateur.findAndCountAll({
                where:   { type: 'benevole' },
                include: [{ model: benevole, required: true }],
                limit,
                offset
            });

            const rows = result.rows.map(b => toBenevoleListDTO(b));
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse({ count: result.count, rows }, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/benevoles/:id
     * @desc    Récupérer un bénévole par ID (ou par Nom/Email via query)
     * @access  Public
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.query;

            let b;
            if (name) {
                b = await benevoleService.getBenevoleByName(name);
            } else if (email) {
                b = await benevoleService.getBenevoleByEmail(email);
            } else {
                b = await benevoleService.getBenevoleById(id);
            }

            return res.status(200).json({
                success: true,
                data: b
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/benevoles/:id
     * @desc    Mettre à jour un bénévole
     * @access  Private (Admin)
     */
    async update(req, res) {
        try {
            const { id } = req.params;

            if (req.file) {
                req.body.photo_profile = `/data/benevoles/${req.file.filename}`;
            }

            const updated = await benevoleService.updateBenevole(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Bénévole mis à jour avec succès.",
                data: updated
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/benevoles/:id
     * @desc    Supprimer un bénévole
     * @access  Private (Admin)
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await benevoleService.deleteBenevole(id);
            return res.status(200).json({
                success: true,
                message: "Bénévole supprimé avec succès."
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new BenevoleController();
