const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Domaine = sequelize.define('Domaine', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nom_fr: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    nom_ar: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    nom_en: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    icone: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    desc_fr: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    desc_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    desc_en: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'domaine',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Domaine;