'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('evenement', {
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
      projet_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'projet',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      titre_fr: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      titre_ar: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      date_debut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      date_fin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lieu: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_fr: {
        type: Sequelize.TEXT,
        allowNull: true
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('evenement');
  }
};
