const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


const admin=sequelize.define('admin',{
    password: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'admin',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = admin;