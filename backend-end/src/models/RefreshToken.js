const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'refresh_token',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = RefreshToken;
