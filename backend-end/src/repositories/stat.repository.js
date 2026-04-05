const { Stat } = require('../models');

class StatRepository {
    async create(data, transaction = null) {
        return await Stat.create(data, { transaction });
    }

    async findAll() {
        return await Stat.findAll({
            order: [['created_at', 'ASC']]
        });
    }

    async findByKey(cle) {
        return await Stat.findOne({ where: { cle } });
    }

    async findById(id) {
        return await Stat.findByPk(id);
    }

    async update(id, updateData, transaction = null) {
        const stat = await Stat.findByPk(id);
        if (stat) {
            return await stat.update(updateData, { transaction });
        }
        return null;
    }

    async delete(id, transaction = null) {
        const stat = await Stat.findByPk(id);
        if (stat) {
            await stat.destroy({ transaction });
            return true;
        }
        return false;
    }
}

module.exports = new StatRepository();
