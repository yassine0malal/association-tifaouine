const adminNotificationService = require('../services/adminNotification.service');
const { toAdminNotificationDTO } = require('../dto/adminNotification.dto');

class AdminNotificationController {
    async getAll(req, res) {
        try {
            const result = await adminNotificationService.getAllNotifications();
            const notifications = result.rows.map(n => toAdminNotificationDTO(n));
            return res.status(200).json({
                success: true,
                count: result.count,
                data: notifications
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des notifications.',
                error: error.message
            });
        }
    }

    async getUnreadCount(req, res) {
        try {
            const count = await adminNotificationService.getUnreadCount();
            return res.status(200).json({
                success: true,
                data: { unreadCount: count }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du nombre de notifications non lues.',
                error: error.message
            });
        }
    }

    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const notification = await adminNotificationService.markAsRead(id);
            return res.status(200).json({
                success: true,
                message: 'Notification marquée comme lue',
                data: toAdminNotificationDTO(notification)
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AdminNotificationController();