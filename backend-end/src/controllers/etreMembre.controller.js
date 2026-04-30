const etreMembreService = require('../services/etreMembre.service');

class EtreMembreController {
    /**
     * @route  POST /api/etre-membre
     * @access Public
     */
    async soumettreDemande(req, res) {
        try {
            const result = await etreMembreService.soumettreDemande(req.body, req.files || {});
            return res.status(201).json({
                success: true,
                message: 'Votre demande d\'adhésion a été soumise avec succès. Nous vous contacterons prochainement.'
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EtreMembreController();
