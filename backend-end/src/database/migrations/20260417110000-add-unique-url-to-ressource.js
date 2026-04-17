'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajouter la colonne nom_original pour la détection de doublon
    await queryInterface.addColumn('ressource', 'nom_original', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'url'
    });

    // Contrainte unique : même nom_original interdit pour le même projet
    await queryInterface.addIndex('ressource', ['nom_original', 'projet_id'], {
      unique: true,
      name: 'ressource_nom_original_projet_unique',
      where: { projet_id: { [Sequelize.Op.ne]: null } }
    });

    // Contrainte unique : même nom_original interdit pour le même événement
    await queryInterface.addIndex('ressource', ['nom_original', 'evenement_id'], {
      unique: true,
      name: 'ressource_nom_original_evenement_unique',
      where: { evenement_id: { [Sequelize.Op.ne]: null } }
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('ressource', 'ressource_nom_original_projet_unique');
    await queryInterface.removeIndex('ressource', 'ressource_nom_original_evenement_unique');
    await queryInterface.removeColumn('ressource', 'nom_original');
  }
};
