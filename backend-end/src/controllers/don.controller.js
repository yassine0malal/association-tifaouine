const donService = require('../services/don.service');
const { buildPaginatedResponse } = require('../utils/paginate');

class DonController {

    /**
     * @route   POST /api/dons/financier
     * @desc    Soumettre un don financier (formulaire public)
     * @access  Public
     */
    async createFinancier(req, res) {
        try {
            const don = await donService.createDonFinancier(req.body);
            return res.status(201).json({
                success: true,
                message: "Votre don financier a été enregistré. Merci pour votre générosité.",
                data: don
            });
        } catch (error) {
            console.error("Erreur createFinancier don controller :", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   POST /api/dons/materiel
     * @desc    Enregistrer un don matériel reçu (saisie admin)
     * @access  Private (Admin)
     */
    async createMateriel(req, res) {
        try {
            const don = await donService.createDonMateriel(req.body);
            return res.status(201).json({
                success: true,
                message: "Don matériel enregistré avec succès.",
                data: don
            });
        } catch (error) {
            console.error("Erreur createMateriel don controller :", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/dons
     * @desc    Récupérer tous les dons (filtres : type_don, statut, type_destination, projet_id)
     * @access  Private (Admin)
     */
    async getAll(req, res) {
        try {
            const { type_don, statut, type_destination, projet_id, search } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await donService.getAllDons({ type_don, statut, type_destination, projet_id, search, limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Impossible de récupérer les dons." });
        }
    }

    /**
     * @route   GET /api/dons/:id
     * @desc    Récupérer un don par ID
     * @access  Private (Admin)
     */
    async getById(req, res) {
        try {
            const don = await donService.getDonById(req.params.id);
            return res.status(200).json({ success: true, data: don });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   PATCH /api/dons/:id/statut
     * @desc    Mettre à jour le statut d'un don (ex: confirmer un don financier)
     * @access  Private (Admin)
     */
    async updateStatut(req, res) {
        try {
            const { statut } = req.body;
            const updated = await donService.updateStatutDon(req.params.id, statut);
            return res.status(200).json({
                success: true,
                message: "Statut du don mis à jour.",
                data: updated
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   DELETE /api/dons/:id
     * @desc    Supprimer un don
     * @access  Private (Admin)
     */
    async delete(req, res) {
        try {
            await donService.deleteDon(req.params.id);
            return res.status(200).json({ success: true, message: "Don supprimé avec succès." });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new DonController();
