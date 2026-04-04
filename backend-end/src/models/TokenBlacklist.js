const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(1000), // Access token might be long
        allowNull: false,
        unique: true,
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'token_blacklist',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Only need to know when it was created/expires
});

module.exports = TokenBlacklist;
