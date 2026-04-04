const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Projet = sequelize.define('Projet', {
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
    statut: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'en_cours',
        validate: {
            isIn: [['planifie', 'en_cours', 'termine', 'suspendu']]
        }
    },
    localisation: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    nb_beneficiaires: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    date_debut: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    date_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isAfterStartDate(value) {
                if (value && this.date_debut && value < this.date_debut) {
                    throw new Error('La date de fin doit être après la date de début');
                }
            }
        }
    },
    budget: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
}, {
    tableName: 'projet',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Projet;
