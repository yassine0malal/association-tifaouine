const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Don = sequelize.define('Don', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        validate: { isEmail: true }
    },
    nom_complet: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    projet_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = Trésorerie générale
    },
    statut: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'recu',
        validate: {
            isIn: [['recu', 'en_attente', 'traite']]
        }
    },
    type_don: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['financier', 'materiel']]
        }
    },
    type_destination: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['general', 'specifique']]
        }
    },
    date_reception: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'don',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Don;
