'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('tifaouine123', salt);

    // Créer un utilisateur
    await queryInterface.bulkInsert('utilisateur', [{
      nom: 'Administrateur',
      email: 'admin@tifaouine.com',
      type: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const users = await queryInterface.sequelize.query(
      `SELECT id from utilisateur WHERE email = 'admin@tifaouine.com';`
    );

    const userId = users[0][0].id;

    await queryInterface.bulkInsert('admin', [{
      password: hashedPassword,
      utilisateur_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin', { utilisateur_id: { [Sequelize.Op.ne]: null } }, {});
    await queryInterface.bulkDelete('utilisateur', { email: 'admin@tifaouine.com' }, {});
  }
};
