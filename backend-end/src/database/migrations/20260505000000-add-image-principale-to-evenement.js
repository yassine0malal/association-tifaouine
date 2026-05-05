'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('evenement', 'image_principale', {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: 'projet_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('evenement', 'image_principale');
  }
};
