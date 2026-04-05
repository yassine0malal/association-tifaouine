const { MessageContact } = require('../models');

class MessageRepository {
    async create(data, transaction = null) {
        return await MessageContact.create(data, { transaction });
    }

    async findAll() {
        return await MessageContact.findAll({
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await MessageContact.findByPk(id);
    }

    async updateStatus(id, luStatus, transaction = null) {
        const message = await MessageContact.findByPk(id);
        if (message) {
            message.lu = luStatus;
            await message.save({ transaction });
            return message;
        }
        return null;
    }

    async delete(id) {
        const message = await MessageContact.findByPk(id);
        if (message) {
            await message.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new MessageRepository();
