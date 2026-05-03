'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Abonne extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Pas d'associations pour le moment
    }

    /**
     * Méthode pour formater la réponse JSON
     */
    toJSON() {
      const values = { ...this.get() };
      return {
        id: values.id,
        email: values.email,
        dateAbonnement: values.created_at,
        updatedAt: values.updated_at
      };
    }
  }

  Abonne.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Format d\'email invalide'
        },
        notEmpty: {
          msg: 'L\'email est requis'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Abonne',
    tableName: 'abonne',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Abonne;
};