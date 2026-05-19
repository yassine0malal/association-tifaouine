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
    photo_profile:{
        type:DataTypes.STRING(250),
        allowNull:true,
    },
    telephone:{
        type:DataTypes.STRING(20),
        allowNull:true,
    },
    competences:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    adresse:{
        type:DataTypes.STRING(255),
        allowNull:true,
    },
    motivation:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    carte_identite:{
        type:DataTypes.STRING(250),
        allowNull:true,
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
            isIn: [['actif', 'inactif', 'suspendu', 'en_attente']]
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