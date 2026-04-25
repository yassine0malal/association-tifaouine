'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('projet', 'partenaires');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('projet', 'partenaires', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'image_principale'
    });
  }
};
