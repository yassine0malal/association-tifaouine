const messageRepository = require('../repositories/message.repository');
const { sequelize, AdminNotification } = require('../models');

class MessageService {
    /**
     * @desc Créer un nouveau message sécurisé par une transaction
     */
    async createMessage(data) {
        return await sequelize.transaction(async (t) => {
            const message = await messageRepository.create(data, t);

            // Notification pour Admin
            await AdminNotification.create({
                type: 'NOUVEAU_CONTACT',
                entity_id: message.id,
                message: `Nouveau message de contact de ${data.nom_complet || 'Anonyme'}`
            }, { transaction: t });

            return message;
        });
    }

    /**
     * @desc Récupérer tous les messages (Admin)
     */
    async getAllMessages(filters = {}) {
        return await messageRepository.findAll(filters);
    }

    /**
     * @desc Récupérer un message par ID (Admin)
     */
    async getMessageById(id) {
        const message = await messageRepository.findById(id);
        if (!message) {
            throw new Error("Message introuvable.");
        }
        return message;
    }

    /**
     * @desc Mettre à jour le statut "lu" d'un message (Admin)
     */
    async updateMessageStatus(id, luStatus) {
        return await sequelize.transaction(async (t) => {
            const message = await messageRepository.updateStatus(id, luStatus, t);
            if (!message) {
                throw new Error("Message introuvable pour la mise à jour.");
            }
            return message;
        });
    }

    /**
     * @desc Supprimer un message (Admin)
     */
    async deleteMessage(id) {
        // Optionnel : on peut utiliser une transaction même pour le delete
        const deleted = await messageRepository.delete(id);
        if (!deleted) {
            throw new Error("Message introuvable ou déjà supprimé.");
        }
        return deleted;
    }
}

module.exports = new MessageService();
