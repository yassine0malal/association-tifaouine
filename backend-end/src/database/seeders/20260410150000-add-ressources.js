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

    // =============== 11. PROJET EAU POTABLE ===============
    const [projetsEauPotable] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Projet Eau Potable' LIMIT 1;`
    );

    if (projetsEauPotable.length > 0) {
      const projetEauPotableId = projetsEauPotable[0].id;
      const eauPotableDir = path.join(__dirname, '../../data/ressources/images/Eau_Potable');

      if (fs.existsSync(eauPotableDir)) {
        const filesEauPotable = fs.readdirSync(eauPotableDir);
        filesEauPotable.forEach((file, index) => {
          allRessources.push({
            projet_id:   projetEauPotableId,
            evenement_id: null,
            type:        'photo',
            url:         `/data/ressources/images/Eau_Potable/${file}`,
            titre_fr:    `Projet Eau Potable - photo ${index + 1}`,
            titre_ar:    `مشروع الماء الصالح للشرب - صورة ${index + 1}`,
            titre_en:    `Drinking Water Project - photo ${index + 1}`,
            created_at:  dateUpload,
            updated_at:  dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Eau Potable non trouvé dans la base.");
    }

    // =============== 12. SOUTIEN À L'ÉDUCATION ET FORMATION ===============
    const [projetsSoutienEdu] = await queryInterface.sequelize.query(
      `SELECT id FROM projet WHERE titre_fr = 'Soutien à l\'éducation et formation - partenariat avec les écoles' LIMIT 1;`
    );

    if (projetsSoutienEdu.length > 0) {
      const projetSoutienEduId = projetsSoutienEdu[0].id;
      const soutienEduDir = path.join(__dirname, '../../data/ressources/images/Soutien_Education');

      if (fs.existsSync(soutienEduDir)) {
        const filesSoutienEdu = fs.readdirSync(soutienEduDir);
        filesSoutienEdu.forEach((file, index) => {
          allRessources.push({
            projet_id:   projetSoutienEduId,
            evenement_id: null,
            type:        'photo',
            url:         `/data/ressources/images/Soutien_Education/${file}`,
            titre_fr:    `Soutien à l'éducation et formation - photo ${index + 1}`,
            titre_ar:    `دعم التربية والتكوين - صورة ${index + 1}`,
            titre_en:    `Support for education and training - photo ${index + 1}`,
            created_at:  dateUpload,
            updated_at:  dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Projet Soutien à l'éducation et formation non trouvé dans la base.");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ██  SECTION ÉVÉNEMENTS  ████████████████████████████████████████████
    // ═══════════════════════════════════════════════════════════════════════

    // =============== 13. VISITE DU SECRÉTAIRE D'ÉTAT ===============
    const [evSecEtat] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Visite du Secrétaire d\\'État chargé du Développement Rural' LIMIT 1;`
    );

    if (evSecEtat.length > 0) {
      const evSecEtatId = evSecEtat[0].id;
      const secEtatDir = path.join(__dirname, '../../data/ressources/images/Communication/Visite_SecEtat');

      if (fs.existsSync(secEtatDir)) {
        const filesSecEtat = fs.readdirSync(secEtatDir);
        filesSecEtat.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evSecEtatId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Visite_SecEtat/${file}`,
            titre_fr:     `Visite du Secrétaire d'État chargé du Développement Rural - photo ${index + 1}`,
            titre_ar:     `زيارة كاتب الدولة المكلف بالتنمية القروية - صورة ${index + 1}`,
            titre_en:     `Visit of the Secretary of State for Rural Development - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Visite Secrétaire d'État non trouvé dans la base.");
    }

    // =============== 14. VISITE DU GOUVERNEUR DU HAOUZ ===============
    const [evGouverneur] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Visite du Gouverneur de la Province du Haouz' LIMIT 1;`
    );

    if (evGouverneur.length > 0) {
      const evGouverneurId = evGouverneur[0].id;
      const gouverneurDir = path.join(__dirname, '../../data/ressources/images/Communication/Visite_Gouverneur');

      if (fs.existsSync(gouverneurDir)) {
        const filesGouverneur = fs.readdirSync(gouverneurDir);
        filesGouverneur.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evGouverneurId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Visite_Gouverneur/${file}`,
            titre_fr:     `Visite du Gouverneur de la Province du Haouz - photo ${index + 1}`,
            titre_ar:     `زيارة عامل صاحب الجلالة على إقليم الحوز - صورة ${index + 1}`,
            titre_en:     `Visit of the Governor of the Province of Haouz - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Visite Gouverneur non trouvé dans la base.");
    }

    // =============== 15. VISITE DU MINISTRE DE L'AGRICULTURE ESPAGNOL ===============
    const [evMinEspagne] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Visite du Ministre de l\\'Agriculture espagnol et du Gouverneur d\\'Andalousie' LIMIT 1;`
    );

    if (evMinEspagne.length > 0) {
      const evMinEspagneId = evMinEspagne[0].id;
      const minEspagneDir = path.join(__dirname, '../../data/ressources/images/Communication/Visite_Ministre_Espagne');

      if (fs.existsSync(minEspagneDir)) {
        const filesMinEspagne = fs.readdirSync(minEspagneDir);
        filesMinEspagne.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evMinEspagneId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Visite_Ministre_Espagne/${file}`,
            titre_fr:     `Visite du Ministre de l'Agriculture espagnol et du Gouverneur d'Andalousie - photo ${index + 1}`,
            titre_ar:     `زيارة وزير الفلاحة الإسباني وحاكم منطقة الأندلس - صورة ${index + 1}`,
            titre_en:     `Visit of the Spanish Minister of Agriculture and Governor of Andalusia - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Visite Ministre Espagne non trouvé dans la base.");
    }

    // =============== 16. ACCUEIL DÉLÉGATIONS SOCIÉTÉ CIVILE ===============
    const [evAccueilDelegations] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Accueil de délégations de la société civile nationale et internationale' LIMIT 1;`
    );

    if (evAccueilDelegations.length > 0) {
      const evAccueilDelegationsId = evAccueilDelegations[0].id;
      const accueilDelegationsDir = path.join(__dirname, '../../data/ressources/images/Communication/Accueil_Delegations');

      if (fs.existsSync(accueilDelegationsDir)) {
        const filesAccueilDelegations = fs.readdirSync(accueilDelegationsDir);
        filesAccueilDelegations.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evAccueilDelegationsId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Accueil_Delegations/${file}`,
            titre_fr:     `Accueil de délégations de la société civile nationale et internationale - photo ${index + 1}`,
            titre_ar:     `استقبال وفود المجتمع المدني الوطني والدولي - صورة ${index + 1}`,
            titre_en:     `Reception of national and international civil society delegations - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Accueil Délégations non trouvé dans la base.");
    }

    // =============== 17. DÉLÉGATION DU SAHARA MAROCAIN ===============
    const [evDelegationSahara] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Accueil d\\'une délégation du Sahara marocain conduite par des parlementaires' LIMIT 1;`
    );

    if (evDelegationSahara.length > 0) {
      const evDelegationSaharaId = evDelegationSahara[0].id;
      const delegationSaharaDir = path.join(__dirname, '../../data/ressources/images/Communication/Delegation_Sahara');

      if (fs.existsSync(delegationSaharaDir)) {
        const filesDelegationSahara = fs.readdirSync(delegationSaharaDir);
        filesDelegationSahara.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evDelegationSaharaId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Delegation_Sahara/${file}`,
            titre_fr:     `Accueil d'une délégation du Sahara marocain conduite par des parlementaires - photo ${index + 1}`,
            titre_ar:     `استقبال وفد من الصحراء المغربية برئاسة برلمانيي المنطقة - صورة ${index + 1}`,
            titre_en:     `Reception of a delegation from the Moroccan Sahara led by regional parliamentarians - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Délégation Sahara non trouvé dans la base.");
    }

    // =============== 18. AGRICULTEURS DE CHEFCHAOUEN ===============
    const [evChefchaouen] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Accueil des agriculteurs de Chefchaouen conduits par le président de la Chambre agricole' LIMIT 1;`
    );

    if (evChefchaouen.length > 0) {
      const evChefchaouenId = evChefchaouen[0].id;
      const chefchaouenDir = path.join(__dirname, '../../data/ressources/images/Communication/Agriculteurs_Chefchaouen');

      if (fs.existsSync(chefchaouenDir)) {
        const filesChefchaouen = fs.readdirSync(chefchaouenDir);
        filesChefchaouen.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evChefchaouenId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Agriculteurs_Chefchaouen/${file}`,
            titre_fr:     `Accueil des agriculteurs de Chefchaouen conduits par le président de la Chambre agricole - photo ${index + 1}`,
            titre_ar:     `استقبال فلاحي منطقة شفشاون برئاسة رئيس الغرفة الفلاحية وبرلمانيي المنطقة - صورة ${index + 1}`,
            titre_en:     `Reception of Chefchaouen farmers led by the president of the Agricultural Chamber - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Agriculteurs Chefchaouen non trouvé dans la base.");
    }

    // =============== 19. VISITE DU DIRECTEUR FIDA ===============
    const [evFida] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Visite du Directeur du Fonds International de Développement Agricole (FIDA)' LIMIT 1;`
    );

    if (evFida.length > 0) {
      const evFidaId = evFida[0].id;
      const fidaDir = path.join(__dirname, '../../data/ressources/images/Communication/Visite_FIDA');

      if (fs.existsSync(fidaDir)) {
        const filesFida = fs.readdirSync(fidaDir);
        filesFida.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evFidaId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Visite_FIDA/${file}`,
            titre_fr:     `Visite du Directeur du Fonds International de Développement Agricole (FIDA) - photo ${index + 1}`,
            titre_ar:     `زيارة مدير الصندوق الدولي للتنمية الزراعية - صورة ${index + 1}`,
            titre_en:     `Visit of the Director of the International Fund for Agricultural Development (IFAD) - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Visite FIDA non trouvé dans la base.");
    }

    // =============== 20. VISITE EN ÉGYPTE ===============
    const [evEgypte] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Visite du président de l\\'association en République d\\'Égypte' LIMIT 1;`
    );

    if (evEgypte.length > 0) {
      const evEgypteId = evEgypte[0].id;
      const egypteDir = path.join(__dirname, '../../data/ressources/images/Communication/Visite_Egypte');

      if (fs.existsSync(egypteDir)) {
        const filesEgypte = fs.readdirSync(egypteDir);
        filesEgypte.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evEgypteId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Visite_Egypte/${file}`,
            titre_fr:     `Visite du président de l'association en République d'Égypte - photo ${index + 1}`,
            titre_ar:     `زيارة رئيس الجمعية لجمهورية مصر - صورة ${index + 1}`,
            titre_en:     `Visit of the association president to the Republic of Egypt - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Visite Égypte non trouvé dans la base.");
    }

    // =============== 21. SIAM - SALON INTERNATIONAL DE L'AGRICULTURE ===============
    const [evSiam] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Salon International de l\\'Agriculture de Meknès (SIAM)' LIMIT 1;`
    );

    if (evSiam.length > 0) {
      const evSiamId = evSiam[0].id;
      const siamDir = path.join(__dirname, '../../data/ressources/images/Agriculture/SIAM');

      if (fs.existsSync(siamDir)) {
        const filesSiam = fs.readdirSync(siamDir);
        filesSiam.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evSiamId,
            type:         'photo',
            url:          `/data/ressources/images/Agriculture/SIAM/${file}`,
            titre_fr:     `Salon International de l'Agriculture de Meknès (SIAM) - photo ${index + 1}`,
            titre_ar:     `المعرض الوطني للفلاحة بمكناس - صورة ${index + 1}`,
            titre_en:     `International Agricultural Fair of Meknès (SIAM) - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement SIAM non trouvé dans la base.");
    }

    // =============== 22. RENCONTRE NATIONALE DÉVELOPPEMENT RURAL MEKNÈS ===============
    const [evRencontreRural] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Rencontre nationale sur le développement rural à Meknès' LIMIT 1;`
    );

    if (evRencontreRural.length > 0) {
      const evRencontreRuralId = evRencontreRural[0].id;
      const rencontreRuralDir = path.join(__dirname, '../../data/ressources/images/Communication/Rencontre_Rural_Meknes');

      if (fs.existsSync(rencontreRuralDir)) {
        const filesRencontreRural = fs.readdirSync(rencontreRuralDir);
        filesRencontreRural.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evRencontreRuralId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Rencontre_Rural_Meknes/${file}`,
            titre_fr:     `Rencontre nationale sur le développement rural à Meknès - photo ${index + 1}`,
            titre_ar:     `الملتقى الوطني للتنمية القروية بمكناس - صورة ${index + 1}`,
            titre_en:     `National meeting on rural development in Meknès - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Rencontre Développement Rural Meknès non trouvé dans la base.");
    }

    // =============== 23. FORUM NATIONAL JEUNESSE RURALE 2000 ===============
    const [evForumJeunesse] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Forum national de la jeunesse rurale 2000' LIMIT 1;`
    );

    if (evForumJeunesse.length > 0) {
      const evForumJeunesseId = evForumJeunesse[0].id;
      const forumJeunesseDir = path.join(__dirname, '../../data/ressources/images/Communication/Forum_Jeunesse_2000');

      if (fs.existsSync(forumJeunesseDir)) {
        const filesForumJeunesse = fs.readdirSync(forumJeunesseDir);
        filesForumJeunesse.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evForumJeunesseId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Forum_Jeunesse_2000/${file}`,
            titre_fr:     `Forum national de la jeunesse rurale 2000 - photo ${index + 1}`,
            titre_ar:     `المنتدى الوطني للشباب القروي 2000 - صورة ${index + 1}`,
            titre_en:     `National Forum of Rural Youth 2000 - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Forum Jeunesse Rurale 2000 non trouvé dans la base.");
    }

    // =============== 24. CAMPAGNES DE SENSIBILISATION ENVIRONNEMENTALE ===============
    const [evCampEnv] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Campagnes de sensibilisation environnementale' LIMIT 1;`
    );

    if (evCampEnv.length > 0) {
      const evCampEnvId = evCampEnv[0].id;
      const campEnvDir = path.join(__dirname, '../../data/ressources/images/Environnement/Campagnes_Sensibilisation');

      if (fs.existsSync(campEnvDir)) {
        const filesCampEnv = fs.readdirSync(campEnvDir);
        filesCampEnv.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evCampEnvId,
            type:         'photo',
            url:          `/data/ressources/images/Environnement/Campagnes_Sensibilisation/${file}`,
            titre_fr:     `Campagnes de sensibilisation environnementale - photo ${index + 1}`,
            titre_ar:     `حملات تحسيسية للمحافظة على البيئة - صورة ${index + 1}`,
            titre_en:     `Environmental awareness campaigns - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Campagnes Sensibilisation Environnementale non trouvé dans la base.");
    }

    // =============== 25. CAMPAGNES DE SENSIBILISATION SANITAIRE ===============
    const [evCampSante] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Campagnes de sensibilisation sanitaire' LIMIT 1;`
    );

    if (evCampSante.length > 0) {
      const evCampSanteId = evCampSante[0].id;
      const campSanteDir = path.join(__dirname, '../../data/ressources/images/Sante/Campagnes_Sensibilisation');

      if (fs.existsSync(campSanteDir)) {
        const filesCampSante = fs.readdirSync(campSanteDir);
        filesCampSante.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evCampSanteId,
            type:         'photo',
            url:          `/data/ressources/images/Sante/Campagnes_Sensibilisation/${file}`,
            titre_fr:     `Campagnes de sensibilisation sanitaire - photo ${index + 1}`,
            titre_ar:     `حملات تحسيسية في المجال الصحي - صورة ${index + 1}`,
            titre_en:     `Health awareness campaigns - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Campagnes Sensibilisation Sanitaire non trouvé dans la base.");
    }

    // =============== 26. CARAVANES MÉDICALES ===============
    const [evCaravanesMed] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Caravanes médicales' LIMIT 1;`
    );

    if (evCaravanesMed.length > 0) {
      const evCaravanesMedId = evCaravanesMed[0].id;
      const caravanesMedDir = path.join(__dirname, '../../data/ressources/images/Sante/Caravanes_Medicales');

      if (fs.existsSync(caravanesMedDir)) {
        const filesCaravanesMed = fs.readdirSync(caravanesMedDir);
        filesCaravanesMed.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evCaravanesMedId,
            type:         'photo',
            url:          `/data/ressources/images/Sante/Caravanes_Medicales/${file}`,
            titre_fr:     `Caravanes médicales - photo ${index + 1}`,
            titre_ar:     `حملات طبية - صورة ${index + 1}`,
            titre_en:     `Medical caravans - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Caravanes Médicales non trouvé dans la base.");
    }

    // =============== 27. PROGRAMME D'ÉDUCATION PARENTALE ===============
    const [evEduParentale] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Programme d\\'éducation parentale' LIMIT 1;`
    );

    if (evEduParentale.length > 0) {
      const evEduParentaleId = evEduParentale[0].id;
      const eduParentaleDir = path.join(__dirname, '../../data/ressources/images/Education/Education_Parentale');

      if (fs.existsSync(eduParentaleDir)) {
        const filesEduParentale = fs.readdirSync(eduParentaleDir);
        filesEduParentale.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evEduParentaleId,
            type:         'photo',
            url:          `/data/ressources/images/Education/Education_Parentale/${file}`,
            titre_fr:     `Programme d'éducation parentale - photo ${index + 1}`,
            titre_ar:     `برنامج التربية الوالدية - صورة ${index + 1}`,
            titre_en:     `Parental education programme - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Programme Éducation Parentale non trouvé dans la base.");
    }

    // =============== 28. SENSIBILISATION ENVIRONNEMENTALE ET FORMATION DES ANIMATEURS ===============
    const [evFormAnimateurs] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Sensibilisation environnementale et formation des animateurs' LIMIT 1;`
    );

    if (evFormAnimateurs.length > 0) {
      const evFormAnimateursId = evFormAnimateurs[0].id;
      const formAnimateursDir = path.join(__dirname, '../../data/ressources/images/Environnement/Formation_Animateurs');

      if (fs.existsSync(formAnimateursDir)) {
        const filesFormAnimateurs = fs.readdirSync(formAnimateursDir);
        filesFormAnimateurs.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evFormAnimateursId,
            type:         'photo',
            url:          `/data/ressources/images/Environnement/Formation_Animateurs/${file}`,
            titre_fr:     `Sensibilisation environnementale et formation des animateurs - photo ${index + 1}`,
            titre_ar:     `التحسيس بالبيئة وتكوين المنشطين البيئيين - صورة ${index + 1}`,
            titre_en:     `Environmental awareness and training of environmental facilitators - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Formation Animateurs Environnementaux non trouvé dans la base.");
    }

    // =============== 29. FORMATIONS DES MEMBRES DE L'ASSOCIATION ===============
    const [evFormMembres] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Formations des membres de l\\'association' LIMIT 1;`
    );

    if (evFormMembres.length > 0) {
      const evFormMembresId = evFormMembres[0].id;
      const formMembresDir = path.join(__dirname, '../../data/ressources/images/Communication/Formation_Membres');

      if (fs.existsSync(formMembresDir)) {
        const filesFormMembres = fs.readdirSync(formMembresDir);
        filesFormMembres.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evFormMembresId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Formation_Membres/${file}`,
            titre_fr:     `Formations des membres de l'association - photo ${index + 1}`,
            titre_ar:     `تكوينات أعضاء الجمعية - صورة ${index + 1}`,
            titre_en:     `Training of association members - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Formations Membres Association non trouvé dans la base.");
    }

    // =============== 30. ÉCHANGES DE VISITES ENTRE ASSOCIATIONS PARTENAIRES ===============
    const [evEchangesVisites] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Échanges de visites entre associations et organisations partenaires' LIMIT 1;`
    );

    if (evEchangesVisites.length > 0) {
      const evEchangesVisitesId = evEchangesVisites[0].id;
      const echangesVisitesDir = path.join(__dirname, '../../data/ressources/images/Communication/Echanges_Visites');

      if (fs.existsSync(echangesVisitesDir)) {
        const filesEchangesVisites = fs.readdirSync(echangesVisitesDir);
        filesEchangesVisites.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evEchangesVisitesId,
            type:         'photo',
            url:          `/data/ressources/images/Communication/Echanges_Visites/${file}`,
            titre_fr:     `Échanges de visites entre associations et organisations partenaires - photo ${index + 1}`,
            titre_ar:     `تبادل الزيارات بين الجمعيات والمنظمات الشريكة - صورة ${index + 1}`,
            titre_en:     `Exchange visits between partner associations and organisations - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Échanges de Visites non trouvé dans la base.");
    }

    // =============== 31. FORMATIONS DES AGRICULTEURS (ÉVÉNEMENT) ===============
    const [evFormAgri] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Formations des agriculteurs dans les domaines agricoles' LIMIT 1;`
    );

    if (evFormAgri.length > 0) {
      const evFormAgriId = evFormAgri[0].id;
      const formAgriEvDir = path.join(__dirname, '../../data/ressources/images/Formation_des_agriculteurs');

      if (fs.existsSync(formAgriEvDir)) {
        const filesFormAgriEv = fs.readdirSync(formAgriEvDir);
        filesFormAgriEv.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evFormAgriId,
            type:         'photo',
            url:          `/data/ressources/images/Formation_des_agriculteurs/${file}`,
            titre_fr:     `Formations des agriculteurs dans les domaines agricoles - photo ${index + 1}`,
            titre_ar:     `تكوينات الفلاحين في مجالات الفلاحة - صورة ${index + 1}`,
            titre_en:     `Training of farmers in agricultural fields - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Formations des agriculteurs non trouvé dans la base.");
    }

    // =============== 32. COURS DE SOUTIEN SCOLAIRE (ÉVÉNEMENT) ===============
    const [evSoutienScolaire] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Cours de soutien scolaire' LIMIT 1;`
    );

    if (evSoutienScolaire.length > 0) {
      const evSoutienScolaireId = evSoutienScolaire[0].id;
      const soutienScolaireEvDir = path.join(__dirname, '../../data/ressources/images/Soutien_Education');

      if (fs.existsSync(soutienScolaireEvDir)) {
        const filesSoutienScolaireEv = fs.readdirSync(soutienScolaireEvDir);
        filesSoutienScolaireEv.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evSoutienScolaireId,
            type:         'photo',
            url:          `/data/ressources/images/Soutien_Education/${file}`,
            titre_fr:     `Cours de soutien scolaire - photo ${index + 1}`,
            titre_ar:     `دروس الدعم للتلاميذ - صورة ${index + 1}`,
            titre_en:     `School support classes - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Cours de soutien scolaire non trouvé dans la base.");
    }

    // =============== 33. FORMATION DES FEMMES AU CLUB FÉMININ (ÉVÉNEMENT) ===============
    const [evFormFemmes] = await queryInterface.sequelize.query(
      `SELECT id FROM evenement WHERE titre_fr = 'Formation des femmes au club féminin' LIMIT 1;`
    );

    if (evFormFemmes.length > 0) {
      const evFormFemmesId = evFormFemmes[0].id;
      const formFemmesEvDir = path.join(__dirname, '../../data/ressources/images/Club_feminin');

      if (fs.existsSync(formFemmesEvDir)) {
        const filesFormFemmesEv = fs.readdirSync(formFemmesEvDir);
        filesFormFemmesEv.forEach((file, index) => {
          allRessources.push({
            projet_id:    null,
            evenement_id: evFormFemmesId,
            type:         'photo',
            url:          `/data/ressources/images/Club_feminin/${file}`,
            titre_fr:     `Formation des femmes au club féminin - photo ${index + 1}`,
            titre_ar:     `تكوين النساء في النادي النسوي - صورة ${index + 1}`,
            titre_en:     `Women's training at the women's club - photo ${index + 1}`,
            created_at:   dateUpload,
            updated_at:   dateUpload
          });
        });
      }
    } else {
      console.warn("⚠️ Événement Formation des femmes au club féminin non trouvé dans la base.");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ██  INSERTION GLOBALE  █████████████████████████████████████████████
    // ═══════════════════════════════════════════════════════════════════════

    // =============== 34. INSERTION GLOBALE ===============
    if (allRessources.length > 0) {
      await queryInterface.bulkInsert('ressource', allRessources);
    } else {
      console.warn("⚠️ Aucune ressource trouvée à insérer.");
    }
  },

  async down(queryInterface, Sequelize) {
    // Suppression de toutes les ressources ajoutées par ce seeder
    await queryInterface.bulkDelete('ressource', {
      url: {
        [Sequelize.Op.or]: [
          // ── Projets ──────────────────────────────────────────────────────
          { [Sequelize.Op.like]: '/data/ressources/images/Hamam/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/energie solaire/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Assainissement/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Amenagement_et_construction/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Club_feminin/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/ecole coranique/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Formation_des_agriculteurs/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Igran d\'Asni/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Projets_DPA/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Sechoir_de_fruits/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Eau_Potable/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Soutien_Education/%' },
          // ── Événements ───────────────────────────────────────────────────
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Visite_SecEtat/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Visite_Gouverneur/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Visite_Ministre_Espagne/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Accueil_Delegations/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Delegation_Sahara/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Agriculteurs_Chefchaouen/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Visite_FIDA/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Visite_Egypte/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Agriculture/SIAM/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Rencontre_Rural_Meknes/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Forum_Jeunesse_2000/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Environnement/Campagnes_Sensibilisation/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Sante/Campagnes_Sensibilisation/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Sante/Caravanes_Medicales/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Education/Education_Parentale/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Environnement/Formation_Animateurs/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Formation_Membres/%' },
          { [Sequelize.Op.like]: '/data/ressources/images/Communication/Echanges_Visites/%' }
        ]
      }
    }, {});
  }
};
