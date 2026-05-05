'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_notification', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('NOUVEAU_CONTACT', 'NOUVEAU_DON', 'NOUVEAU_BENEVOLE', 'NOUVEAU_MEMBRE', 'NOUVEL_ABONNE'),
        allowNull: false
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admin_notification');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_admin_notification_type";');
  }
};
