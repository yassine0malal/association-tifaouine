'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projet', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      domaine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'domaine',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      titre_fr: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      titre_ar: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      statut: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'en_cours'
        // Contraintes de validation Sequelize gérées au niveau du modèle
      },
      localisation: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      nb_beneficiaires: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      date_debut: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      date_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      budget: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Optionnel : Ajout d'une contrainte de check au niveau SQL si nécessaire
    // await queryInterface.addConstraint('projet', { fields: ['nb_beneficiaires'], type: 'check', where: { nb_beneficiaires: { [Sequelize.Op.gte]: 0 } } });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projet');
  }
};
