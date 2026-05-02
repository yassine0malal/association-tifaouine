const { MessageContact } = require('../models');
const { Op, sequelize } = require('sequelize');

class MessageRepository {
    async create(data, transaction = null) {
        return await MessageContact.create(data, { transaction });
    }

    async findAll(filters = {}) {
        const { limit, offset, objet, lu, dateDebut, dateFin } = filters;
        
        // Construction des conditions de filtrage
        const whereConditions = {};
        
        // Filtre par objet (type de demande)
        if (objet) {
            whereConditions.objet = objet;
        }
        
        // Filtre par statut de lecture
        if (typeof lu === 'boolean') {
            whereConditions.lu = lu;
        }
        
        // Filtre par plage de dates
        if (dateDebut || dateFin) {
            whereConditions.created_at = {};
            if (dateDebut) {
                whereConditions.created_at[Op.gte] = new Date(dateDebut);
            }
            if (dateFin) {
                // Ajouter 23:59:59 à la date de fin pour inclure toute la journée
                const endDate = new Date(dateFin);
                endDate.setHours(23, 59, 59, 999);
                whereConditions.created_at[Op.lte] = endDate;
            }
        }
        
        return await MessageContact.findAndCountAll({
            where: whereConditions,
            order: [['created_at', 'DESC']],
            limit: limit || 10,
            offset: offset || 0
        });
    }

    /**
     * Obtenir les statistiques des messages
     */
    async getMessageStats(filters = {}) {
        const { dateDebut, dateFin } = filters;
        
        const whereConditions = {};
        
        // Filtre par plage de dates
        if (dateDebut || dateFin) {
            whereConditions.created_at = {};
            if (dateDebut) {
                whereConditions.created_at[Op.gte] = new Date(dateDebut);
            }
            if (dateFin) {
                const endDate = new Date(dateFin);
                endDate.setHours(23, 59, 59, 999);
                whereConditions.created_at[Op.lte] = endDate;
            }
        }
        
        // Statistiques générales
        const total = await MessageContact.count({ where: whereConditions });
        const nonLus = await MessageContact.count({ 
            where: { ...whereConditions, lu: false } 
        });
        const lus = await MessageContact.count({ 
            where: { ...whereConditions, lu: true } 
        });
        
        // Statistiques par objet
        const parObjet = await MessageContact.findAll({
            where: whereConditions,
            attributes: [
                'objet',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['objet'],
            raw: true
        });
        
        return {
            total,
            lus,
            nonLus,
            parObjet
        };
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
