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
        allowNull: true,
    },
    evenement_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    nom_original: {
        type: DataTypes.STRING(255),
        allowNull: true, // nom du fichier tel qu'envoyé par le client
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
    },
    description_fr: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_en: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    file_size: {
        type: DataTypes.INTEGER, // octets
        allowNull: true,
    },
    file_type: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    image_couverture: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    tableName: 'ressource',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Ressource;
