const {DataTypes}=require('sequelize');
const {sequelize}=require('../config/database');

const benevole=sequelize.define('benevole',{
    mession:{
        type:DataTypes.STRING(250),
        allowNull:true,
        defaultValue:'benevole'
    },
    disponibilite:{
        type:DataTypes.STRING(250),
        allowNull:true,
        defaultValue:'null'
    },
    date_adhesion:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['actif', 'inactif', 'suspendu']]
        }
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'benevole',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = benevole;