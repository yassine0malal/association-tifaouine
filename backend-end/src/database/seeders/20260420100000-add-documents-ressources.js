'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // ── Tailles réelles des fichiers PDF ────────────────────────────────────
    const getSize = (relPath) => {
      try {
        const abs = path.join(__dirname, '../../data/ressources', relPath);
        return fs.existsSync(abs) ? fs.statSync(abs).size : null;
      } catch { return null; }
    };

    const documents = [
      // ── 1. RAPPORT ────────────────────────────────────────────────────────
      {
        projet_id:       null,
        evenement_id:    null,
        type:            'rapport',
        url:             '/data/ressources/documents/r-1776551479864-683160.pdf',
        nom_original:    'rapport-annuel-tifaouine.pdf',
        titre_fr:        'Rapport annuel de l\'association Tifaouine',
        titre_ar:        'التقرير السنوي لجمعية تيفاوين',
        titre_en:        'Tifaouine Association Annual Report',
        description_fr:  'Rapport annuel présentant les activités, projets réalisés et bilan financier de l\'association Tifaouine.',
        description_ar:  'التقرير السنوي الذي يعرض أنشطة وإنجازات ومشاريع جمعية تيفاوين.',
        description_en:  'Annual report presenting the activities, completed projects and financial overview of Tifaouine Association.',
        file_size:       getSize('documents/r-1776551479864-683160.pdf'),
        file_type:       'pdf',
        image_couverture: '/data/ressources/images/documents/couvertures/image_doc.jpg',
        is_featured:     false,
        created_at:      now,
        updated_at:      now,
      },

      // ── 2. GUIDE ──────────────────────────────────────────────────────────
      {
        projet_id:       null,
        evenement_id:    null,
        type:            'guide',
        url:             '/data/ressources/documents/r-1776552865489-84822.pdf',
        nom_original:    'guide-pratique-tifaouine.pdf',
        titre_fr:        'Guide pratique des projets de développement rural',
        titre_ar:        'الدليل العملي لمشاريع التنمية القروية',
        titre_en:        'Practical Guide for Rural Development Projects',
        description_fr:  'Guide pratique destiné aux acteurs locaux pour la mise en œuvre des projets de développement rural dans la région d\'Asni.',
        description_ar:  'دليل عملي موجه للفاعلين المحليين لتنفيذ مشاريع التنمية القروية في منطقة أسني.',
        description_en:  'Practical guide for local stakeholders on implementing rural development projects in the Asni region.',
        file_size:       getSize('documents/r-1776552865489-84822.pdf'),
        file_type:       'pdf',
        image_couverture: '/data/ressources/images/documents/couvertures/image_doc_2.png',
        is_featured:     true,
        created_at:      now,
        updated_at:      now,
      },

      // ── 3. DOCUMENT ───────────────────────────────────────────────────────
      {
        projet_id:       null,
        evenement_id:    null,
        type:            'document',
        url:             '/data/ressources/documents/ccn_9_bouhaddach_omar_tp1-1775661762914-876013447.pdf',
        nom_original:    'convention-partenariat-tifaouine.pdf',
        titre_fr:        'Convention de partenariat et cadre de coopération',
        titre_ar:        'اتفاقية الشراكة وإطار التعاون',
        titre_en:        'Partnership Agreement and Cooperation Framework',
        description_fr:  'Document officiel définissant le cadre de coopération entre l\'association Tifaouine et ses partenaires institutionnels.',
        description_ar:  'وثيقة رسمية تحدد إطار التعاون بين جمعية تيفاوين وشركائها المؤسسيين.',
        description_en:  'Official document defining the cooperation framework between Tifaouine Association and its institutional partners.',
        file_size:       getSize('documents/ccn_9_bouhaddach_omar_tp1-1775661762914-876013447.pdf'),
        file_type:       'pdf',
        image_couverture: '/data/ressources/images/documents/couvertures/image_doc_3.png',
        is_featured:     false,
        created_at:      now,
        updated_at:      now,
      },
    ];

    await queryInterface.bulkInsert('ressource', documents);
    console.log(`✅ ${documents.length} documents insérés (rapport, guide, document).`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ressource', {
      nom_original: [
        'rapport-annuel-tifaouine.pdf',
        'guide-pratique-tifaouine.pdf',
        'convention-partenariat-tifaouine.pdf',
      ]
    }, {});
  }
};
