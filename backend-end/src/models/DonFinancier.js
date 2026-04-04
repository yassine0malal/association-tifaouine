const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DonFinancier = sequelize.define('DonFinancier', {
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
    montant: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0.01 }
    },
    devise: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: 'MAD'
    },
    ref_transaction: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'don_financier',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DonFinancier;
