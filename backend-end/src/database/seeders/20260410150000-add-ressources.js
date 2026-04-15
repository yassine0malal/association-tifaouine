'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Hiérarchie des ressources :
 *
 * images/projets/NOM/galerie/    → galerie du projet    (projet_id != null)
 * images/projets/NOM/principal/  → image principale     (projet_id != null, type: 'photo')
 * images/evenements/.../galerie/ → galerie événement    (evenement_id != null)
 * images/evenements/.../principal/ → image principale   (evenement_id != null)
 * images/association/            → ressources générales (projet_id = null, evenement_id = null)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const allRessources = [];
    const dateUpload = new Date();
    const BASE = path.join(__dirname, '../../data/ressources/images');

    // ─── Helper : lire un dossier et pousser les ressources ─────────────────
    const addFromDir = (dirPath, urlBase, projet_id, evenement_id, titreFn) => {
      if (!fs.existsSync(dirPath)) return;
      fs.readdirSync(dirPath).forEach((file, index) => {
        if (file.startsWith('.')) return;
        const { fr, ar, en } = titreFn(index + 1);
        allRessources.push({
          projet_id,
          evenement_id,
          type:       'photo',
          url:        `${urlBase}/${file}`,
          titre_fr:   fr,
          titre_ar:   ar,
          titre_en:   en,
          created_at: dateUpload,
          updated_at: dateUpload
        });
      });
    };

    // ─── Helper : récupérer la première image d'un dossier principal ────────
    const getImagePrincipale = (dirPath, urlBase) => {
      if (!fs.existsSync(dirPath)) return null;
      const files = fs.readdirSync(dirPath).filter(f => !f.startsWith('.'));
      return files.length > 0 ? `${urlBase}/${files[0]}` : null;
    };

    // ─── Récupérer les IDs ───────────────────────────────────────────────────
    const [projets] = await queryInterface.sequelize.query(`SELECT id, titre_fr FROM projet`);
    const P = {};
    projets.forEach(p => { P[p.titre_fr] = p.id; });

    const [evenements] = await queryInterface.sequelize.query(`SELECT id, titre_fr FROM evenement`);
    const E = {};
    evenements.forEach(e => { E[e.titre_fr] = e.id; });

    // ════════════════════════════════════════════════════════════════════════
    // 1. PROJETS — galerie + principal
    // ════════════════════════════════════════════════════════════════════════

    const projetsConfig = [
      {
        dir: 'projets/Eau_Potable',
        titre_fr: 'Projet Eau Potable',
        label: { fr: 'Projet Eau Potable', ar: 'مشروع الماء الصالح للشرب', en: 'Drinking Water Project' }
      },
      {
        dir: 'projets/Assainissement',
        titre_fr: 'Projet Assainissement',
        label: { fr: 'Projet Assainissement', ar: 'مشروع الصرف الصحي', en: 'Sanitation Project' }
      },
      {
        dir: 'projets/Amenagement_et_construction',
        titre_fr: 'Aménagement et construction du siège de l\'association',
        label: { fr: 'Siège de l\'association', ar: 'مقر الجمعية', en: 'Association headquarters' }
      },
      {
        dir: 'projets/Club_feminin',
        titre_fr: 'Club féminin, centre de formation et préscolaire',
        label: { fr: 'Club féminin', ar: 'النادي النسوي', en: 'Women\'s club' }
      },
      {
        dir: 'projets/ecole_coranique',
        titre_fr: 'Jardin d\'enfants et école coranique',
        label: { fr: 'École coranique', ar: 'روض الأطفال ومأوى حفظة القرآن', en: 'Quranic school' }
      },
      {
        dir: 'projets/Hamam',
        titre_fr: 'Projet Hammam Public',
        label: { fr: 'Hammam Public', ar: 'الحمام العمومي', en: 'Public Hammam' }
      },
      {
        dir: 'projets/energie_solaire',
        titre_fr: 'Alimentation en eau potable du musée environnemental',
        label: { fr: 'Musée environnemental', ar: 'المتحف البيئي', en: 'Environmental museum' }
      },
      {
        dir: 'projets/Formation_des_agriculteurs',
        titre_fr: 'Formation des agriculteurs de montagne pour la culture des roses',
        label: { fr: 'Formation agriculteurs', ar: 'تكوين الفلاحين', en: 'Farmers training' }
      },
      {
        dir: 'projets/Igran_Asni',
        titre_fr: 'Projet Igran d\'Asni',
        label: { fr: 'Igran d\'Asni', ar: 'مشروع اكران نوسني', en: 'Igran d\'Asni' }
      },
      {
        dir: 'projets/Projets_DPA',
        titre_fr: 'Projets DPA Marrakech - Programme FIDA',
        label: { fr: 'Projets DPA FIDA', ar: 'مشاريع المديرية الإقليمية للفلاحة', en: 'DPA FIDA Projects' }
      },
      {
        dir: 'projets/Sechoir_de_fruits',
        titre_fr: 'Séchoir de fruits et plantes aromatiques et médicinales',
        label: { fr: 'Séchoir de fruits', ar: 'مجفف الفواكه', en: 'Fruit dryer' }
      },
      {
        dir: 'projets/Soutien_Education',
        titre_fr: 'Soutien à l\'éducation et formation - partenariat avec les écoles',
        label: { fr: 'Soutien éducation', ar: 'دعم التعليم', en: 'Education support' }
      }
    ];

    for (const cfg of projetsConfig) {
      const pid = P[cfg.titre_fr] || null;
      const urlBase = `/data/ressources/images/${cfg.dir}`;

      // Galerie
      addFromDir(
        path.join(BASE, cfg.dir, 'galerie'),
        `${urlBase}/galerie`,
        pid, null,
        i => ({ fr: `${cfg.label.fr} - photo ${i}`, ar: `${cfg.label.ar} - صورة ${i}`, en: `${cfg.label.en} - photo ${i}` })
      );

      // Image principale (1 seule image dans principal/)
      addFromDir(
        path.join(BASE, cfg.dir, 'principal'),
        `${urlBase}/principal`,
        pid, null,
        () => ({ fr: `${cfg.label.fr} - image principale`, ar: `${cfg.label.ar} - الصورة الرئيسية`, en: `${cfg.label.en} - main image` })
      );

      // Mettre à jour le champ image_principale dans la table projet
      if (pid) {
        const imagePrincipale = getImagePrincipale(
          path.join(BASE, cfg.dir, 'principal'),
          `${urlBase}/principal`
        );
        if (imagePrincipale) {
          await queryInterface.sequelize.query(
            `UPDATE projet SET image_principale = ? WHERE id = ?`,
            { replacements: [imagePrincipale, pid] }
          );
        }
      }
    }

    // ════════════════════════════════════════════════════════════════════════
    // 2. ÉVÉNEMENTS — galerie + principal
    // ════════════════════════════════════════════════════════════════════════

    const evenementsConfig = [
      {
        dir: 'evenements/Communication/Accueil_Delegations',
        titre_fr: 'Accueil de délégations de la société civile nationale et internationale',
        label: { fr: 'Accueil délégations', ar: 'استقبال الوفود', en: 'Delegations reception' }
      },
      {
        dir: 'evenements/Communication/Visite_Egypte',
        titre_fr: 'Visite du président de l\'association en République d\'Égypte',
        label: { fr: 'Visite Égypte', ar: 'زيارة مصر', en: 'Egypt visit' }
      },
      {
        dir: 'evenements/Communication/Visite_Ministre_Espagne',
        titre_fr: 'Visite du Ministre de l\'Agriculture espagnol et du Gouverneur d\'Andalousie',
        label: { fr: 'Visite Ministre Espagne', ar: 'زيارة وزير الفلاحة الإسباني', en: 'Spanish Minister visit' }
      },
      {
        dir: 'evenements/Environnement/Campagnes_Sensibilisation',
        titre_fr: 'Campagnes de sensibilisation environnementale',
        label: { fr: 'Campagne environnement', ar: 'حملة البيئة', en: 'Environment campaign' }
      },
      {
        dir: 'evenements/Environnement/Formation_Animateurs',
        titre_fr: 'Sensibilisation environnementale et formation des animateurs',
        label: { fr: 'Formation animateurs', ar: 'تكوين المنشطين', en: 'Facilitators training' }
      },
      {
        dir: 'evenements/Sante/Campagnes_Sensibilisation',
        titre_fr: 'Campagnes de sensibilisation sanitaire',
        label: { fr: 'Campagne santé', ar: 'حملة الصحة', en: 'Health campaign' }
      },
      {
        dir: 'evenements/Sante/Caravanes_Medicales',
        titre_fr: 'Caravanes médicales',
        label: { fr: 'Caravane médicale', ar: 'قافلة طبية', en: 'Medical caravan' }
      },
      {
        dir: 'evenements/Education/Education_Parentale',
        titre_fr: 'Programme d\'éducation parentale',
        label: { fr: 'Éducation parentale', ar: 'التربية الوالدية', en: 'Parental education' }
      }
    ];

    for (const cfg of evenementsConfig) {
      const eid = E[cfg.titre_fr] || null;
      const urlBase = `/data/ressources/images/${cfg.dir}`;

      addFromDir(
        path.join(BASE, cfg.dir, 'galerie'),
        `${urlBase}/galerie`,
        null, eid,
        i => ({ fr: `${cfg.label.fr} - photo ${i}`, ar: `${cfg.label.ar} - صورة ${i}`, en: `${cfg.label.en} - photo ${i}` })
      );

      addFromDir(
        path.join(BASE, cfg.dir, 'principal'),
        `${urlBase}/principal`,
        null, eid,
        () => ({ fr: `${cfg.label.fr} - image principale`, ar: `${cfg.label.ar} - الصورة الرئيسية`, en: `${cfg.label.en} - main image` })
      );
    }

    // ════════════════════════════════════════════════════════════════════════
    // 3. RESSOURCES GÉNÉRALES DE L'ASSOCIATION (projet_id = null, evenement_id = null)
    // ════════════════════════════════════════════════════════════════════════

    addFromDir(
      path.join(BASE, 'association'),
      '/data/ressources/images/association',
      null, null,
      i => ({ fr: `Association Tifaouine - photo ${i}`, ar: `جمعية تيفاوين - صورة ${i}`, en: `Tifaouine Association - photo ${i}` })
    );

    // ─── Insertion ───────────────────────────────────────────────────────────
    if (allRessources.length > 0) {
      await queryInterface.bulkInsert('ressource', allRessources);
      console.log(`✅ ${allRessources.length} ressources insérées.`);
    } else {
      console.warn('⚠️ Aucune ressource trouvée. Vérifiez que les dossiers galerie/ contiennent des fichiers.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ressource', {
      url: { [Sequelize.Op.like]: '/data/ressources/images/%' }
    }, {});
  }
};
