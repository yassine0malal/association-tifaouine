const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


const membre=sequelize.define('membre',{
    poste:{
        type: DataTypes.STRING(100),
        allowNull:true,
        defaultValue:'membre' 
    },
    description_poste_fr: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_poste_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_poste_en: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    photo_profile:{
        type:DataTypes.STRING(250),
        allowNull:true,
        defaultValue:'null'
    },
    date_adhesion:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    competences: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    adresse: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    motivation: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    carte_identite: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    cv: {
        type: DataTypes.STRING(250),
        allowNull: true,
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
    tableName: 'membre',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = membre;
