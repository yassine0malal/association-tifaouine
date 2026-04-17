const ressourceService = require('../services/ressource.service');
const { buildPaginatedResponse } = require('../utils/paginate');

class RessourceController {
    /**
     * @route   GET /api/projets/:id/ressources
     * @desc    Récupérer les ressources d'un projet par son ID
     * @access  Public
     */
    async getByProjetId(req, res) {
        try {
            const { type } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await ressourceService.getRessourcesByProjetId(req.params.id, { type, limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            const status = error.message.includes('introuvable') ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/ressources
     * @desc    Récupérer toutes les ressources filtrables
     */
    async getAll(req, res) {
        try {
            const { type, projet_id, evenement_id } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await ressourceService.getAllRessources({ 
                type, 
                projet_id, 
                evenement_id, 
                limit, 
                offset 
            });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des ressources", error: error.message });
        }
    }

    /**
     * @route   GET /api/ressources/:id
     * @desc    Récupérer une ressource
     */
    async getById(req, res) {
        try {
            const ressource = await ressourceService.getRessourceById(req.params.id);
            return res.status(200).json({
                success: true,
                data: ressource
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   POST /api/ressources
     * @desc    Upload et création d'une ou plusieurs ressources (Admin)
     */
    async create(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Aucun fichier n'a été fourni"
                });
            }

            const created = [];
            for (const file of req.files) {
                const urlEntry = req.uploadedUrls[file._urlIndex];
                const ressourceData = {
                    ...req.body,
                    url: `${urlEntry.relUrl}/${file.filename}`
                };
                const nvRessource = await ressourceService.createRessource(ressourceData);
                created.push(nvRessource);
            }

            return res.status(201).json({
                success: true,
                message: `${created.length} ressource(s) ajoutée(s) avec succès`,
                data: created.length === 1 ? created[0] : created
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Erreur lors de l'ajout de la ressource",
                error: error.message
            });
        }
    }

    /**
     * @route   PUT /api/ressources/:id
     * @desc    Mettre à jour les métadonnées (Admin)
     */
    async update(req, res) {
        try {
            const misAjour = await ressourceService.updateRessource(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: "Ressource mise à jour avec succès",
                data: misAjour
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/ressources/:id
     * @desc    Supprimer une ressource (DB + Disque)
     */
    async delete(req, res) {
        try {
            await ressourceService.deleteRessource(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Ressource et fichier supprimés avec succès"
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new RessourceController();
