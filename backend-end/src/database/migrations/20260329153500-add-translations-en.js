'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajout des colonnes English (_en) pour la traduction

    // Table: stat
    await queryInterface.addColumn('stat', 'label_en', {
      type: Sequelize.STRING(120),
      allowNull: false,
      defaultValue: ''
    });

    // Table: ressource
    await queryInterface.addColumn('ressource', 'titre_en', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    // Table: projet
    await queryInterface.addColumn('projet', 'titre_en', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: ''
    });

    // Table: partenariat
    await queryInterface.addColumn('partenariat', 'description_en', {
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: ''
    });

    // Table: evenement
    await queryInterface.addColumn('evenement', 'titre_en', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addColumn('evenement', 'description_en', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Table: domaine
    await queryInterface.addColumn('domaine', 'nom_en', {
      type: Sequelize.STRING(120),
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addColumn('domaine', 'desc_en', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    // Ajout de desc_ar car il manquait pour la cohérence
    await queryInterface.addColumn('domaine', 'desc_ar', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('stat', 'label_en');
    await queryInterface.removeColumn('ressource', 'titre_en');
    await queryInterface.removeColumn('projet', 'titre_en');
    await queryInterface.removeColumn('partenariat', 'description_en');
    await queryInterface.removeColumn('evenement', 'titre_en');
    await queryInterface.removeColumn('evenement', 'description_en');
    await queryInterface.removeColumn('domaine', 'nom_en');
    await queryInterface.removeColumn('domaine', 'desc_en');
    await queryInterface.removeColumn('domaine', 'desc_ar');
  }
};
