const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ressource = sequelize.define('Ressource', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    projet_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = Ressource générale de l'association
    },
    type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['photo', 'video', 'rapport', 'guide', 'document']]
        }
    },
    url: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    titre_fr: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    titre_ar: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    titre_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    tableName: 'ressource',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Ressource;
