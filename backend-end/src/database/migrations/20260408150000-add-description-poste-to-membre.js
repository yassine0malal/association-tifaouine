'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('membre', 'description_poste_fr', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'poste'
    });
    await queryInterface.addColumn('membre', 'description_poste_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'description_poste_fr'
    });
    await queryInterface.addColumn('membre', 'description_poste_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'description_poste_ar'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('membre', 'description_poste_en');
    await queryInterface.removeColumn('membre', 'description_poste_ar');
    await queryInterface.removeColumn('membre', 'description_poste_fr');
  }
};
