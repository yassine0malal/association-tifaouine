'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cle: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true
      },
      valeur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      label_fr: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      label_ar: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      icone: {
        type: Sequelize.STRING(80),
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
    await queryInterface.dropTable('stat');
  }
};
