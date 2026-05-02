const messageService = require('../services/message.service');
const { buildPaginatedResponse } = require('../utils/paginate');

class MessageController {
    /**
     * @desc    Créer un message (Public)
     */
    async create(req, res) {
        try {
            const { nom_complet, email, objet, message } = req.body;

            // Validation de base
            if (!nom_complet || !email || !objet || !message) {
                return res.status(400).json({
                    success: false,
                    message: "Tous les champs (nom_complet, email, objet, message) sont obligatoires."
                });
            }

            // Validation du format d'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Le format de l'email est invalide."
                });
            }

            // Validation de l'objet (Enum)
            const validObjets = ['DEMANDE_PARTENARIAT', 'DEMANDE_BENEVOLE', 'DEMANDE_MEMBRE', 'DEMANDE_SERVICE', 'DEMANDE_INFORMATION'];
            if (!validObjets.includes(objet)) {
                return res.status(400).json({
                    success: false,
                    message: `L'objet doit être parmi : ${validObjets.join(', ')}`
                });
            }

            const newMessage = await messageService.createMessage({
                nom_complet,
                email,
                objet,
                message
            });

            return res.status(201).json({
                success: true,
                message: "Votre message a été envoyé avec succès.",
                data: newMessage
            });
        } catch (error) {
            console.error("Erreur creation message:", error);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'envoi du message.",
                error: error.message
            });
        }
    }

    /**
     * @desc    Récupérer tous les messages (Admin)
     */
    async getAll(req, res) {
        try {
            // const { page, limit, offset } = req.pagination;
            const result = await messageService.getAllMessages();
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des messages.", error: error.message });
        }
    }

    /**
     * @desc    Récupérer un message par ID (Admin)
     */
    async getById(req, res) {
        try {
            const message = await messageService.getMessageById(req.params.id);
            return res.status(200).json({
                success: true,
                data: message
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @desc    Mettre à jour le statut du message (lu/non lu) (Admin)
     */
    async updateStatus(req, res) {
        try {
            const { lu } = req.body;
            
            if (typeof lu !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: "Le champ 'lu' doit être un booléen (true/false)."
                });
            }

            const message = await messageService.updateMessageStatus(req.params.id, lu);
            return res.status(200).json({
                success: true,
                message: "Statut du message mis à jour.",
                data: message
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @desc    Supprimer un message (Admin)
     */
    async delete(req, res) {
        try {
            await messageService.deleteMessage(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Message supprimé avec succès."
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new MessageController();
