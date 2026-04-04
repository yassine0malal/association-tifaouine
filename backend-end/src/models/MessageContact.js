const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MessageContact = sequelize.define('MessageContact', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nom_complet: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    objet: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    lu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    tableName: 'message',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MessageContact;
