'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const allRessources = [];
    const dateUpload = new Date();

    // =============== 1. HAMMAM PUBLIC ===============
    const [projetsHammam] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Projet Hammam Public' LIMIT 1;`
    );

    if (projetsHammam.length > 0) {
      const projetHammamId = projetsHammam[0].id;
      const hammamDir = path.join(__dirname, '../../data/ressources/images/Hamam');
      
      if (fs.existsSync(hammamDir)) {
        const filesHammam = fs.readdirSync(hammamDir);
        filesHammam.forEach((file, index) => {
          allRessources.push({
            projet_id: projetHammamId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Hamam/${file}`,
            titre_fr: `Rénovation du hammam de l'association après le séisme - ${index + 1}`,
            titre_ar: `ترميم حمام الجمعية بعد الزلزال - ${index + 1}`,
            titre_en: `Restoration of the association's hammam after the earthquake - ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Hammam non trouvé dans la base.");
    }

    // =============== 2. ÉNERGIE SOLAIRE (EAU POTABLE) ===============
    const [projetsEnergie] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Alimentation en eau potable du musée environnemental' LIMIT 1;`
    );

    if (projetsEnergie.length > 0) {
      const projetEnergieId = projetsEnergie[0].id;
      const energieDir = path.join(__dirname, '../../data/ressources/images/energie solaire');
      
      if (fs.existsSync(energieDir)) {
        const filesEnergie = fs.readdirSync(energieDir);
        filesEnergie.forEach((file, index) => {
          allRessources.push({
            projet_id: projetEnergieId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/energie solaire/${file}`,
            titre_fr: `Énergie solaire pour le puits d'eau potable - ${index + 1}`,
            titre_ar: `الطاقة الشمسية لبئر الماء الصالح للشرب - ${index + 1}`,
            titre_en: `Solar energy for the drinking water well - ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet d'Alimentation en eau potable non trouvé dans la base.");
    }

    // =============== 3. INSERTION GLOBALE ===============
    if (allRessources.length > 0) {
      await queryInterface.bulkInsert('ressource', allRessources);
    } else {
      console.warn("⚠️ Aucune ressource trouvée à insérer.");
    }
  },

  async down(queryInterface, Sequelize) {
    // Suppression des ressources ajoutées
    await queryInterface.bulkDelete('ressource', {
      url: {
        [Sequelize.Op.or]: [
          { [Sequelize.Op.like]: '/data/ressources/images/Hamam/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/energie solaire/%' }
        ]
      }
    }, {});
  }
};
