const etreBenevoleService = require('../services/etreBenevole.service');

class EtreBenevoleController {
    /**
     * @route  POST /api/etre-benevole
     * @access Public
     */
    async soumettreDemande(req, res) {
        try {
            await etreBenevoleService.soumettreDemande(req.body, req.files || {});
            return res.status(201).json({
                success: true,
                message: "Votre demande de bénévolat a été soumise avec succès. Nous vous contacterons prochainement."
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EtreBenevoleController();
