'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ressource', 'evenement_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'evenement',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ressource', 'evenement_id');
  }
};
