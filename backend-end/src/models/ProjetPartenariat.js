const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjetPartenariat = sequelize.define('ProjetPartenariat', {
    projet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    partenariat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'projet_partenariat',
    timestamps: false
});

module.exports = ProjetPartenariat;
