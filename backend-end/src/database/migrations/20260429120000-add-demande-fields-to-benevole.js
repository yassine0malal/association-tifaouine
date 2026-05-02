'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('benevole', 'photo_profile', {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
    await queryInterface.addColumn('benevole', 'telephone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn('benevole', 'competences', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('benevole', 'adresse', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('benevole', 'motivation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('benevole', 'carte_identite', {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('benevole', 'photo_profile');
    await queryInterface.removeColumn('benevole', 'telephone');
    await queryInterface.removeColumn('benevole', 'competences');
    await queryInterface.removeColumn('benevole', 'adresse');
    await queryInterface.removeColumn('benevole', 'motivation');
    await queryInterface.removeColumn('benevole', 'carte_identite');
  }
};
