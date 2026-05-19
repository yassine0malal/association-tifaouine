'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── Champs descriptifs (utiles pour documents/rapports/guides, null pour photos/vidéos)
    await queryInterface.addColumn('ressource', 'description_fr', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'titre_en'
    });
    await queryInterface.addColumn('ressource', 'description_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'description_fr'
    });
    await queryInterface.addColumn('ressource', 'description_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'description_ar'
    });

    // ── Métadonnées fichier (calculées à l'upload, null pour photos/vidéos si non souhaité)
    await queryInterface.addColumn('ressource', 'file_size', {
      type: Sequelize.INTEGER, // taille en octets
      allowNull: true,
      after: 'description_en'
    });
    await queryInterface.addColumn('ressource', 'file_type', {
      type: Sequelize.STRING(10), // ex: 'pdf', 'docx', 'xlsx'
      allowNull: true,
      after: 'file_size'
    });

    await queryInterface.addColumn('ressource', 'image_couverture', {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: 'file_type'
    });

    // ── Index unique pour les ressources de l'association (projet_id IS NULL ET evenement_id IS NULL)
    // Complète les deux index partiels existants (projet != null, evenement != null)
    await queryInterface.addIndex('ressource', ['nom_original'], {
      unique: true,
      name: 'ressource_nom_original_association_unique',
      where: {
        projet_id:    null,
        evenement_id: null
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('ressource', 'ressource_nom_original_association_unique');
    await queryInterface.removeColumn('ressource', 'image_couverture');
    await queryInterface.removeColumn('ressource', 'file_type');
    await queryInterface.removeColumn('ressource', 'file_size');
    await queryInterface.removeColumn('ressource', 'description_en');
    await queryInterface.removeColumn('ressource', 'description_ar');
    await queryInterface.removeColumn('ressource', 'description_fr');
  }
};
