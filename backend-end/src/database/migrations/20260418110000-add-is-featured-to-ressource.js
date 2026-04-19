'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ressource', 'is_featured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'image_couverture'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ressource', 'is_featured');
  }
};
