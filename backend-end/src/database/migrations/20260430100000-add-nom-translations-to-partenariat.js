'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Renommer nom -> nom_fr
    await queryInterface.renameColumn('partenariat', 'nom', 'nom_fr');

    // Ajouter nom_ar et nom_en
    await queryInterface.addColumn('partenariat', 'nom_ar', {
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addColumn('partenariat', 'nom_en', {
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: ''
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('partenariat', 'nom_en');
    await queryInterface.removeColumn('partenariat', 'nom_ar');
    await queryInterface.renameColumn('partenariat', 'nom_fr', 'nom');
  }
};
