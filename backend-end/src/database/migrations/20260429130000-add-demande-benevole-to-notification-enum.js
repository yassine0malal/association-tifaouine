'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_admin_notification_type" ADD VALUE IF NOT EXISTS 'DEMANDE_BENEVOLE';`
    );
  },

  async down() {
    console.warn('Rollback manuel requis : supprimer DEMANDE_BENEVOLE de enum_admin_notification_type');
  }
};
