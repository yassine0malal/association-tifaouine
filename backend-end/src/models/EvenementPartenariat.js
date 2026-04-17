const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EvenementPartenariat = sequelize.define('EvenementPartenariat', {
    evenement_id: {
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
    tableName: 'evenement_partenariat',
    timestamps: false
});

module.exports = EvenementPartenariat;
