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

    // =============== 3. PROJET ASSAINISSEMENT ===============
    const [projetsAssainissement] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Projet Assainissement' LIMIT 1;`
    );

    if (projetsAssainissement.length > 0) {
      const projetAssainId = projetsAssainissement[0].id;
      const assainDir = path.join(__dirname, '../../data/ressources/images/Assainissement');
      
      if (fs.existsSync(assainDir)) {
        const filesAssain = fs.readdirSync(assainDir);
        filesAssain.forEach((file, index) => {
          allRessources.push({
            projet_id: projetAssainId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Assainissement/${file}`,
            titre_fr: `Projet Assainissement - photo ${index + 1}`,
            titre_ar: `مشروع الصرف الصحي - صورة ${index + 1}`,
            titre_en: `Sanitation Project - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Assainissement non trouvé dans la base.");
    }

    // =============== 4. SIÈGE DE L'ASSOCIATION ===============
    const [projetsSiege] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Aménagement et construction du siège de l''association' LIMIT 1;`
    );

    if (projetsSiege.length > 0) {
      const projetSiegeId = projetsSiege[0].id;
      const siegeDir = path.join(__dirname, '../../data/ressources/images/Amenagement_et_construction');
      
      if (fs.existsSync(siegeDir)) {
        const filesSiege = fs.readdirSync(siegeDir);
        filesSiege.forEach((file, index) => {
          allRessources.push({
            projet_id: projetSiegeId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Amenagement_et_construction/${file}`,
            titre_fr: `Aménagement et construction du siège de l'association - photo ${index + 1}`,
            titre_ar: `ترميم وبناء مقر الجمعية - صورة ${index + 1}`,
            titre_en: `Development and construction of the association headquarters - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Siège non trouvé dans la base.");
    }

    // =============== 5. CLUB FÉMININ ===============
    const [projetsClub] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Club féminin, centre de formation et préscolaire' LIMIT 1;`
    );

    if (projetsClub.length > 0) {
      const projetClubId = projetsClub[0].id;
      const clubDir = path.join(__dirname, '../../data/ressources/images/Club_feminin');
      
      if (fs.existsSync(clubDir)) {
        const filesClub = fs.readdirSync(clubDir);
        filesClub.forEach((file, index) => {
          allRessources.push({
            projet_id: projetClubId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Club_feminin/${file}`,
            titre_fr: `Club féminin, centre de formation et préscolaire - photo ${index + 1}`,
            titre_ar: `النادي النسوي ومركز التكوين والتعليم الأولي - صورة ${index + 1}`,
            titre_en: `Women's club, training center and preschool - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Club féminin non trouvé dans la base.");
    }

    // =============== 6. JARDIN D'ENFANTS ET ÉCOLE CORANIQUE ===============
    const [projetsEcole] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Jardin d''enfants et école coranique' LIMIT 1;`
    );

    if (projetsEcole.length > 0) {
      const projetEcoleId = projetsEcole[0].id;
      const ecoleDir = path.join(__dirname, '../../data/ressources/images/ecole coranique');
      
      if (fs.existsSync(ecoleDir)) {
        const filesEcole = fs.readdirSync(ecoleDir);
        filesEcole.forEach((file, index) => {
          allRessources.push({
            projet_id: projetEcoleId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/ecole coranique/${file}`,
            titre_fr: `Jardin d'enfants et école coranique - photo ${index + 1}`,
            titre_ar: `روض الأطفال ومأوى حفظة القرآن الكريم - صورة ${index + 1}`,
            titre_en: `Kindergarten and Quranic school - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet École coranique non trouvé dans la base.");
    }

    // =============== 7. FORMATION DES AGRICULTEURS ===============
    const [projetsAgri] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Formation des agriculteurs de montagne pour la culture des roses' LIMIT 1;`
    );

    if (projetsAgri.length > 0) {
      const projetAgriId = projetsAgri[0].id;
      const agriDir = path.join(__dirname, '../../data/ressources/images/Formation_des_agriculteurs');
      
      if (fs.existsSync(agriDir)) {
        const filesAgri = fs.readdirSync(agriDir);
        filesAgri.forEach((file, index) => {
          allRessources.push({
            projet_id: projetAgriId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Formation_des_agriculteurs/${file}`,
            titre_fr: `Formation des agriculteurs de montagne pour la culture des roses - photo ${index + 1}`,
            titre_ar: `تكوين فلاحي المناطق الجبلية للعناية بالورديات - صورة ${index + 1}`,
            titre_en: `Training of mountain farmers for rose cultivation - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Formation agriculteurs non trouvé dans la base.");
    }

    // =============== 8. IGRAN D'ASNI ===============
    const [projetsIgran] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Projet Igran d''Asni' LIMIT 1;`
    );

    if (projetsIgran.length > 0) {
      const projetIgranId = projetsIgran[0].id;
      const igranDir = path.join(__dirname, '../../data/ressources/images/Igran d\'Asni');
      
      if (fs.existsSync(igranDir)) {
        const filesIgran = fs.readdirSync(igranDir);
        filesIgran.forEach((file, index) => {
          allRessources.push({
            projet_id: projetIgranId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Igran d'Asni/${file}`,
            titre_fr: `Projet Igran d'Asni - photo ${index + 1}`,
            titre_ar: `مشروع اكران نوسني - Igran d'Asni - صورة ${index + 1}`,
            titre_en: `Igran d'Asni Project - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Igran d'Asni non trouvé dans la base.");
    }

    // =============== 9. PROJETS DPA - FIDA ===============
    const [projetsDpa] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Projets DPA Marrakech - Programme FIDA' LIMIT 1;`
    );

    if (projetsDpa.length > 0) {
      const projetDpaId = projetsDpa[0].id;
      const dpaDir = path.join(__dirname, '../../data/ressources/images/Projets_DPA');
      
      if (fs.existsSync(dpaDir)) {
        const filesDpa = fs.readdirSync(dpaDir);
        filesDpa.forEach((file, index) => {
          allRessources.push({
            projet_id: projetDpaId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Projets_DPA/${file}`,
            titre_fr: `Projets DPA Marrakech - Programme FIDA - photo ${index + 1}`,
            titre_ar: `مشاريع المديرية الإقليمية للفلاحة في إطار مشروع FIDA - صورة ${index + 1}`,
            titre_en: `DPA Marrakech Projects - FIDA Programme - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projets DPA - FIDA non trouvé dans la base.");
    }

    // =============== 10. SÉCHOIR DE FRUITS ===============
    const [projetsSechoir] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Séchoir de fruits et plantes aromatiques et médicinales' LIMIT 1;`
    );

    if (projetsSechoir.length > 0) {
      const projetSechoirId = projetsSechoir[0].id;
      const sechoirDir = path.join(__dirname, '../../data/ressources/images/Sechoir_de_fruits');
      
      if (fs.existsSync(sechoirDir)) {
        const filesSechoir = fs.readdirSync(sechoirDir);
        filesSechoir.forEach((file, index) => {
          allRessources.push({
            projet_id: projetSechoirId,
            evenement_id: null,
            type: 'photo',
            url: `/data/ressources/images/Sechoir_de_fruits/${file}`,
            titre_fr: `Séchoir de fruits et plantes aromatiques et médicinales - photo ${index + 1}`,
            titre_ar: `مشروع مجفف الفواكه والأعشاب الطبية والعطرية - صورة ${index + 1}`,
            titre_en: `Fruit and aromatic and medicinal plant dryer - photo ${index + 1}`,
            created_at: dateUpload,
            updated_at: dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Séchoir de fruits non trouvé dans la base.");
    }

    // =============== 11. INSERTION GLOBALE ===============
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
          { [Sequelize.Op.like]: '/data/ressources/images/energie solaire/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Assainissement/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Amenagement_et_construction/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Club_feminin/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/ecole coranique/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Formation_des_agriculteurs/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Igran d\'Asni/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Projets_DPA/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Sechoir_de_fruits/%' }
        ]
      }
    }, {});
  }
};
