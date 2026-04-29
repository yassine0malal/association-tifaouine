'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('membre', 'telephone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn('membre', 'competences', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('membre', 'adresse', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('membre', 'motivation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('membre', 'carte_identite', {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
    await queryInterface.addColumn('membre', 'cv', {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('membre', 'telephone');
    await queryInterface.removeColumn('membre', 'competences');
    await queryInterface.removeColumn('membre', 'adresse');
    await queryInterface.removeColumn('membre', 'motivation');
    await queryInterface.removeColumn('membre', 'carte_identite');
    await queryInterface.removeColumn('membre', 'cv');
  }
};
