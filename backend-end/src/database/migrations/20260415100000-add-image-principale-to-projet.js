'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projet', 'image_principale', {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: 'domaine_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projet', 'image_principale');
  }
};
