const { AdminNotification } = require('../models');

class AdminNotificationRepository {
    async create(data, transaction = null) {
        return await AdminNotification.create(data, { transaction });
    }

    async findAll(filters = {}) {
        return await AdminNotification.findAndCountAll({
            where: filters,
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await AdminNotification.findByPk(id);
    }

    async updateStatus(id, status) {
        const notification = await AdminNotification.findByPk(id);
        if (notification) {
            notification.status = status;
            await notification.save();
            return notification;
        }
        return null;
    }
    
    async countUnread() {
        return await AdminNotification.count({ where: { status: false } });
    }
}

module.exports = new AdminNotificationRepository();