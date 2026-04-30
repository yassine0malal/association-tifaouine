'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_admin_notification_type" ADD VALUE IF NOT EXISTS 'DEMANDE_MEMBRE';`
    );
  },

  async down() {
    // PostgreSQL ne supporte pas la suppression d'une valeur d'enum
    // Pour rollback : recréer l'enum sans cette valeur (opération manuelle)
    console.warn('Rollback manuel requis : supprimer DEMANDE_MEMBRE de enum_admin_notification_type');
  }
};
