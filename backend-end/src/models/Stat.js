const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stat = sequelize.define('Stat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    cle: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
    },
    valeur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    label_fr: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    label_ar: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    label_en: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    icone: {
        type: DataTypes.STRING(80),
        allowNull: true,
    }
}, {
    tableName: 'stat',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Stat;
