const projetService = require('../services/projet.service');

class ProjetController {
    /**
     * @route   GET /api/projets
     * @desc    Récupérer tous les projets avec filtres (domaine_id, annee)
     */
    async getAll(req, res) {
        try {
            const { domaine_id, annee } = req.query;
            const projets = await projetService.getAllProjets({
                domaine_id,
                annee
            });
            return res.status(200).json({
                success: true,
                count: projets.length,
                data: projets
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des projets",
                error: error.message
            });
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

    /**
     * @route   POST /api/projets
     * @desc    Créer un nouveau projet (Admin seulement)
     */
    async create(req, res) {
        try {
            const nvProjet = await projetService.createProjet(req.body);
            return res.status(201).json({
                success: true,
                message: "Projet créé avec succès",
                data: nvProjet
            });
        } catch (error) {
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
            const misAjour = await projetService.updateProjet(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: "Projet mis à jour avec succès",
                data: misAjour
            });
        } catch (error) {
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
