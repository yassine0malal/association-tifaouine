const messageService = require('../services/message.service');
const { buildPaginatedResponse } = require('../utils/paginate');

class MessageController {
    /**
     * @desc    Créer un message (Public)
     */
    async create(req, res) {
        try {
            const { nom_complet, email, objet, message } = req.body;
            console.log(nom_complet)
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
     * @desc    Récupérer tous les messages avec filtres (Admin)
     * @route   GET /api/messages
     * @query   page, limit, objet, lu, dateDebut, dateFin
     */
    async getAll(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const { objet, lu, dateDebut, dateFin } = req.query;

            // Validation des filtres
            const filters = { limit, offset };

            // Filtre par objet
            if (objet) {
                const validObjets = ['DEMANDE_PARTENARIAT', 'DEMANDE_BENEVOLE', 'DEMANDE_MEMBRE', 'DEMANDE_SERVICE', 'DEMANDE_INFORMATION'];
                if (!validObjets.includes(objet)) {
                    return res.status(400).json({
                        success: false,
                        message: `L'objet doit être parmi : ${validObjets.join(', ')}`
                    });
                }
                filters.objet = objet;
            }

            // Filtre par statut de lecture
            if (lu !== undefined) {
                if (lu === 'true') {
                    filters.lu = true;
                } else if (lu === 'false') {
                    filters.lu = false;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Le paramètre 'lu' doit être 'true' ou 'false'"
                    });
                }
            }

            // Filtre par dates
            if (dateDebut) {
                const startDate = new Date(dateDebut);
                if (isNaN(startDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Format de date invalide pour 'dateDebut'. Utilisez YYYY-MM-DD"
                    });
                }
                filters.dateDebut = dateDebut;
            }

            if (dateFin) {
                const endDate = new Date(dateFin);
                if (isNaN(endDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Format de date invalide pour 'dateFin'. Utilisez YYYY-MM-DD"
                    });
                }
                filters.dateFin = dateFin;
            }

            // Validation de la cohérence des dates
            if (dateDebut && dateFin && new Date(dateDebut) > new Date(dateFin)) {
                return res.status(400).json({
                    success: false,
                    message: "La date de début ne peut pas être postérieure à la date de fin"
                });
            }

            const result = await messageService.getAllMessages(filters);

            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit),
                filters: {
                    objet: objet || null,
                    lu: lu !== undefined ? (lu === 'true') : null,
                    dateDebut: dateDebut || null,
                    dateFin: dateFin || null
                }
            });
        } catch (error) {
            console.error("Erreur récupération messages:", error);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des messages.",
                error: error.message
            });
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

    /**
     * @desc    Obtenir les statistiques des messages (Admin)
     * @route   GET /api/messages/stats
     * @query   dateDebut, dateFin
     */
    async getStats(req, res) {
        try {
            const { dateDebut, dateFin } = req.query;
            const filters = {};

            // Validation des dates si fournies
            if (dateDebut) {
                const startDate = new Date(dateDebut);
                if (isNaN(startDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Format de date invalide pour 'dateDebut'. Utilisez YYYY-MM-DD"
                    });
                }
                filters.dateDebut = dateDebut;
            }

            if (dateFin) {
                const endDate = new Date(dateFin);
                if (isNaN(endDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Format de date invalide pour 'dateFin'. Utilisez YYYY-MM-DD"
                    });
                }
                filters.dateFin = dateFin;
            }

            // Validation de la cohérence des dates
            if (dateDebut && dateFin && new Date(dateDebut) > new Date(dateFin)) {
                return res.status(400).json({
                    success: false,
                    message: "La date de début ne peut pas être postérieure à la date de fin"
                });
            }

            const stats = await messageService.getMessageStats(filters);

            return res.status(200).json({
                success: true,
                data: stats,
                periode: {
                    dateDebut: dateDebut || null,
                    dateFin: dateFin || null
                }
            });
        } catch (error) {
            console.error("Erreur récupération statistiques messages:", error);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des statistiques.",
                error: error.message
            });
        }
    }
}

module.exports = new MessageController();
