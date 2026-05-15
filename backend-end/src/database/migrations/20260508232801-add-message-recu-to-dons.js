'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('don', 'message', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('don_financier', 'recu', {
      type: Sequelize.STRING(250),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('don', 'message');
    await queryInterface.removeColumn('don_financier', 'recu');
  }
};
