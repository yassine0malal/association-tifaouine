'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('evenement_partenariat', {
      evenement_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'evenement', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      partenariat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'partenariat', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('evenement_partenariat');
  }
};
