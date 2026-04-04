'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('token_blacklist', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING(1000), // Access token might be long
        allowNull: false,
        unique: true
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
      // Pas de updated_at : on a seulement besoin de savoir quand le token a été blacklisté
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('token_blacklist');
  }
};
