const adminNotificationRepository = require('../repositories/adminNotification.repository');

class AdminNotificationService {
    /**
     * @desc    Créer une nouvelle notification pour les administrateurs
     * @param   {Object} data - Type, entity_id, message
     * @param   {Object} transaction - Transaction Sequelize optionnelle
     */
    async createNotification(data, transaction = null) {
        return await adminNotificationRepository.create(data, transaction);
    }

    /**
     * @desc    Récupérer toutes les notifications administrateurs
     */
    async getAllNotifications(filters = {}) {
        return await adminNotificationRepository.findAll(filters);
    }

    /**
     * @desc    Marquer une notification comme lue
     */
    async markAsRead(id) {
        const notification = await adminNotificationRepository.updateStatus(id, true);
        if (!notification) {
            throw new Error('Notification non trouvée');
        }
        return notification;
    }

    /**
     * @desc    Récupérer le nombre de notifications non lues
     */
    async getUnreadCount() {
        return await adminNotificationRepository.countUnread();
    }
}

module.exports = new AdminNotificationService();