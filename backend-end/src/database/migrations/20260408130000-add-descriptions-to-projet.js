'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projet', 'description_fr', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'titre_en'
    });

    await queryInterface.addColumn('projet', 'description_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'description_fr'
    });

    await queryInterface.addColumn('projet', 'description_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'description_ar'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projet', 'description_en');
    await queryInterface.removeColumn('projet', 'description_ar');
    await queryInterface.removeColumn('projet', 'description_fr');
  }
};
