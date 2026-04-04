const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DonMateriel = sequelize.define('DonMateriel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    don_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        validate: { min: 1 }
    },
    date_decision: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'don_materiel',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DonMateriel;
