'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projet', 'partenaires', {
      type: Sequelize.TEXT,
      allowNull: true, // NULL = projet réalisé par l'association seule
      after: 'image_principale'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projet', 'partenaires');
  }
};
