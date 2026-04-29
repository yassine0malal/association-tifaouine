const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdminNotification = sequelize.define('AdminNotification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('NOUVEAU_CONTACT', 'NOUVEAU_DON', 'NOUVEAU_BENEVOLE', 'NOUVEAU_MEMBRE'),
        allowNull: false
    },
    entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the related entity (Contact, Don, Benevole, Membre)'
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'False = Unread, True = Read'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'admin_notification',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = AdminNotification;
