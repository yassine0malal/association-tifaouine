'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('don', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(180),
        allowNull: false
      },
      nom_complet: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      telephone: {
        type: Sequelize.STRING(20),
        allowNull: true
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
      statut: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'recu'
      },
      type_don: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      type_destination: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      date_reception: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    await queryInterface.dropTable('don');
  }
};
