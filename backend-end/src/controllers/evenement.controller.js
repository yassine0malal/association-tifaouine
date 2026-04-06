const evenementService = require('../services/evenement.service');

class EvenementController {
    /**
     * @route   GET /api/evenements
     * @desc    Récupérer tous les événements avec filtres (domaine_id, projet_id, annee)
     */
    async getAll(req, res) {
        try {
            const { domaine_id, projet_id, annee } = req.query;
            const eves = await evenementService.getAllEvenements({
                domaine_id,
                projet_id,
                annee
            });
            return res.status(200).json({
                success: true,
                count: eves.length,
                data: eves
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des événements",
                error: error.message
            });
        }
    }

    /**
     * @route   GET /api/evenements/:id
     * @desc    Récupérer un événement par ID
     */
    async getById(req, res) {
        try {
            const eve = await evenementService.getEvenementById(req.params.id);
            return res.status(200).json({
                success: true,
                data: eve
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   POST /api/evenements
     * @desc    Créer un événement (Admin)
     */
    async create(req, res) {
        try {
            const nvEve = await evenementService.createEvenement(req.body);
            return res.status(201).json({
                success: true,
                message: "Événement créé avec succès",
                data: nvEve
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Erreur lors de la création de l'événement",
                error: error.message
            });
        }
    }

    /**
     * @route   PUT /api/evenements/:id
     * @desc    Mettre à jour un événement (Admin)
     */
    async update(req, res) {
        try {
            const misAjour = await evenementService.updateEvenement(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: "Événement mis à jour avec succès",
                data: misAjour
            });
        } catch (error) {
            const status = error.message.includes('introuvable') ? 404 : 400;
            return res.status(status).json({
                success: false,
                message: "Erreur lors de la mise à jour de l'événement",
                error: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/evenements/:id
     * @desc    Supprimer un événement (Admin)
     */
    async delete(req, res) {
        try {
            await evenementService.deleteEvenement(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Événement supprimé avec succès"
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: "Erreur lors de la suppression de l'événement",
                error: error.message
            });
        }
    }
}

module.exports = new EvenementController();
