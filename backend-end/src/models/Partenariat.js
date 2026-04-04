const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Partenariat = sequelize.define('Partenariat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nom: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    description_fr: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description_ar: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description_en: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    site_web: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    tableName: 'partenariat',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Partenariat;
