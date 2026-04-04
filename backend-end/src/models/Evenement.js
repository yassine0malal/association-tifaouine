const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Evenement = sequelize.define('Evenement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    domaine_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    projet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    titre_fr: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    titre_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    titre_en: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    date_debut: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    date_fin: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isAfterStartDate(value) {
                if (value && this.date_debut && value < this.date_debut) {
                    throw new Error('La date de fin doit être après la date de début');
                }
            }
        }
    },
    lieu: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    description_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_fr: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_en: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'evenement',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Evenement;
