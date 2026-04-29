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
 * documents/                     → documents de l'association (type: 'rapport', 'guide', 'document')
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const allRessources = [];
    const dateUpload = new Date();
    const IMAGES_BASE = path.join(__dirname, '../../data/ressources/images');
    const DOCS_BASE = path.join(__dirname, '../../data/ressources/documents');

    // ─── Helper : lire un dossier et pousser les ressources (images) ─────────
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
          is_featured: false,
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
        path.join(IMAGES_BASE, cfg.dir, 'galerie'),
        `${urlBase}/galerie`,
        pid, null,
        i => ({ fr: `${cfg.label.fr} - photo ${i}`, ar: `${cfg.label.ar} - صورة ${i}`, en: `${cfg.label.en} - photo ${i}` })
      );

      // Image principale (1 seule image dans principal/)
      addFromDir(
        path.join(IMAGES_BASE, cfg.dir, 'principal'),
        `${urlBase}/principal`,
        pid, null,
        () => ({ fr: `${cfg.label.fr} - image principale`, ar: `${cfg.label.ar} - الصورة الرئيسية`, en: `${cfg.label.en} - main image` })
      );

      // Mettre à jour le champ image_principale dans la table projet
      if (pid) {
        const imagePrincipale = getImagePrincipale(
          path.join(IMAGES_BASE, cfg.dir, 'principal'),
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
        path.join(IMAGES_BASE, cfg.dir, 'galerie'),
        `${urlBase}/galerie`,
        null, eid,
        i => ({ fr: `${cfg.label.fr} - photo ${i}`, ar: `${cfg.label.ar} - صورة ${i}`, en: `${cfg.label.en} - photo ${i}` })
      );

      addFromDir(
        path.join(IMAGES_BASE, cfg.dir, 'principal'),
        `${urlBase}/principal`,
        null, eid,
        () => ({ fr: `${cfg.label.fr} - image principale`, ar: `${cfg.label.ar} - الصورة الرئيسية`, en: `${cfg.label.en} - main image` })
      );
    }

    // ════════════════════════════════════════════════════════════════════════
    // 3. RESSOURCES GÉNÉRALES DE L'ASSOCIATION (projet_id = null, evenement_id = null)
    // ════════════════════════════════════════════════════════════════════════

    addFromDir(
      path.join(IMAGES_BASE, 'association'),
      '/data/ressources/images/association',
      null, null,
      i => ({ fr: `Association Tifaouine - photo ${i}`, ar: `جمعية تيفاوين - صورة ${i}`, en: `Tifaouine Association - photo ${i}` })
    );

    // ════════════════════════════════════════════════════════════════════════
    // 4. DOCUMENTS DE L'ASSOCIATION (Rapports, Guides, etc.)
    // ════════════════════════════════════════════════════════════════════════

    const documentsConfig = [
      {
        file: '9be04f28-a712-4cf4-9dba-a9bdf3267f48_OS_PROJECT.pdf',
        type: 'rapport',
        titre: { fr: "Rapport Projet OS", ar: "تقرير مشروع نظام التشغيل", en: "OS Project Report" },
        desc: { fr: "Rapport détaillé sur le projet de système d'exploitation.", ar: "تقرير مفصل عن مشروع نظام التشغيل.", en: "Detailed report on the operating system project." },
        couverture: '/data/ressources/images/documents/couvertures/1.png'
      },
      {
        file: 'Analyse_opc.pdf',
        type: 'guide',
        titre: { fr: "Guide d'Analyse OPC", ar: "دليل تحليل OPC", en: "OPC Analysis Guide" },
        desc: { fr: "Document technique d'analyse des protocoles de communication.", ar: "وثيقة تقنية لتحليل بروتوكولات الاتصال.", en: "Technical document for analysis of communication protocols." },
        couverture: '/data/ressources/images/documents/couvertures/2.png'
      },
      {
        file: 'CCNA-_Introduction_to_Networks_certificate_bouhaddachomar-gmail-com_4858bdba-0758-45e4-abd0-a78e46df2ebf.pdf',
        type: 'document',
        titre: { fr: "Certificat CCNA - Introduction aux Réseaux", ar: "شهادة CCNA - مقدمة في الشبكات", en: "CCNA Certificate - Introduction to Networks" },
        desc: { fr: "Certificat attestant de la réussite du cours CCNA Introduction to Networks.", ar: "شهادة تثبت النجاح في دورة CCNA مقدمة في الشبكات.", en: "Certificate of completion for the CCNA Introduction to Networks course." },
        couverture: '/data/ressources/images/documents/couvertures/4.jpg'
      },
      {
        file: 'CCN_9_Bouhaddach_Omar_TP2.pdf',
        type: 'rapport',
        titre: { fr: "TP2 Réseaux Informatiques", ar: "الأعمال التطبيقية 2 - شبكات الحاسوب", en: "TP2 Computer Networks" },
        desc: { fr: "Compte rendu des travaux pratiques sur les réseaux (TP2).", ar: "تقرير الأعمال التطبيقية حول الشبكات (TP2).", en: "Report on computer networks practical work (TP2)." },
        couverture: '/data/ressources/images/documents/couvertures/5.jpeg'
      },
      {
        file: 'CCN_9_Bouhaddach_Omar_TP4.pdf',
        type: 'rapport',
        titre: { fr: "TP4 Réseaux Informatiques", ar: "الأعمال التطبيقية 4 - شبكات الحاسوب", en: "TP4 Computer Networks" },
        desc: { fr: "Compte rendu des travaux pratiques sur les réseaux (TP4).", ar: "تقرير الأعمال التطبيقية حول الشبكات (TP4).", en: "Report on computer networks practical work (TP4)." },
        couverture: '/data/ressources/images/documents/couvertures/6.jpeg'
      },
      {
        file: 'Design sans titre (1).pdf',
        type: 'document',
        titre: { fr: "Document de Design", ar: "وثيقة التصميم", en: "Design Document" },
        desc: { fr: "Document contenant les concepts de design.", ar: "وثيقة تحتوي على مفاهيم التصميم.", en: "Document containing design concepts." },
        couverture: '/data/ressources/images/documents/couvertures/7.webp'
      },
      {
        file: 'Lettre pro français .pdf',
        type: 'document',
        titre: { fr: "Modèle de Lettre Professionnelle", ar: "نموذج رسالة مهنية", en: "Professional Letter Template" },
        desc: { fr: "Exemple de lettre professionnelle en français.", ar: "نموذج لرسالة مهنية بالفرنسية.", en: "Example of a professional letter in French." },
        couverture: '/data/ressources/images/documents/couvertures/8.png'
      },
      {
        file: 'Linux_Unhatched_certificate_bouhaddachomar-gmail-com_69e41656-0599-48da-a6f4-fca4c89158c8.pdf',
        type: 'document',
        titre: { fr: "Certificat Linux Unhatched", ar: "شهادة Linux Unhatched", en: "Linux Unhatched Certificate" },
        desc: { fr: "Certificat d'introduction à Linux.", ar: "شهادة مقدمة في نظام لينكس.", en: "Certificate for Linux introduction course." },
        couverture: '/data/ressources/images/documents/couvertures/9.png'
      },
      {
        file: 'Parcours-OPC-UA-Smart-Industries.pdf',
        type: 'guide',
        titre: { fr: "Parcours OPC UA & Smart Industries", ar: "مسار OPC UA والصناعات الذكية", en: "OPC UA & Smart Industries Track" },
        desc: { fr: "Guide sur le parcours de formation Smart Industries.", ar: "دليل حول مسار التكوين في الصناعات الذكية.", en: "Guide on the Smart Industries training track." },
        couverture: '/data/ressources/images/documents/couvertures/10.jpg'
      },
      {
        file: 'Profile (1).pdf',
        type: 'document',
        titre: { fr: "Profil Utilisateur", ar: "الملف الشخصي", en: "User Profile" },
        desc: { fr: "Document de profil.", ar: "وثيقة الملف الشخصي.", en: "Profile document." },
        couverture: '/data/ressources/images/documents/couvertures/11.png'
      },
      {
        file: 'Résumé fr communication.pdf',
        type: 'rapport',
        titre: { fr: "Résumé de Communication", ar: "ملخص التواصل", en: "Communication Summary" },
        desc: { fr: "Résumé des activités de communication.", ar: "ملخص لأنشطة التواصل.", en: "Summary of communication activities." },
        couverture: '/data/ressources/images/documents/couvertures/12.png'
      },
      {
        file: 'TP1_Linux-Machine virtuelle-Principes Fondamentaux de Linux.pdf',
        type: 'rapport',
        titre: { fr: "TP1 Linux et Machines Virtuelles", ar: "الأعمال التطبيقية 1 - لينكس والأجهزة الافتراضية", en: "TP1 Linux and Virtual Machines" },
        desc: { fr: "Principes fondamentaux de Linux et utilisation de machines virtuelles.", ar: "المبادئ الأساسية للينكس واستخدام الأجهزة الافتراضية.", en: "Fundamental principles of Linux and use of virtual machines." },
        couverture: '/data/ressources/images/documents/couvertures/13.png'
      },
      {
        file: 'TP3 Script-Shell.pdf',
        type: 'rapport',
        titre: { fr: "TP3 Scripts Shell", ar: "الأعمال التطبيقية 3 - نصوص الشل", en: "TP3 Shell Scripts" },
        desc: { fr: "Travaux pratiques sur la programmation shell sous Linux.", ar: "أعمال تطبيقية حول برمجة الشل في لينكس.", en: "Practical work on shell programming in Linux." },
        couverture: '/data/ressources/images/documents/couvertures/14.png'
      },
      {
        file: 'TP4 user_management_access_control_files_rep.pdf',
        type: 'rapport',
        titre: { fr: "TP4 Gestion des Utilisateurs", ar: "الأعمال التطبيقية 4 - إدارة المستخدمين", en: "TP4 User Management" },
        desc: { fr: "Gestion des utilisateurs et contrôle d'accès aux fichiers.", ar: "إدارة المستخدمين والتحكم في الوصول إلى الملفات.", en: "User management and file access control." },
        couverture: '/data/ressources/images/documents/couvertures/15.png'
      },
      {
        file: 'TheseKORDESTANI.pdf',
        type: 'rapport',
        titre: { fr: "Thèse de Doctorat - Kordestani", ar: "أطروحة الدكتوراه - كوردستاني", en: "PhD Thesis - Kordestani" },
        desc: { fr: "Document de thèse académique.", ar: "وثيقة أطروحة أكاديمية.", en: "Academic thesis document." },
        couverture: '/data/ressources/images/documents/couvertures/16.png'
      },
      {
        file: 'ccn_9_bouhaddach_omar_tp1-1775661762914-876013447.pdf',
        type: 'rapport',
        is_featured: true,
        titre: {
          fr: "Rapport annuel de l'association Tifaouine",
          ar: "التقرير السنوي لجمعية تيفاوين",
          en: "Tifaouine Association Annual Report"
        },
        desc: {
          fr: "Rapport annuel présentant les activités, projets réalisés et bilan financier de l'association Tifaouine.",
          ar: "التقرير السنوي الذي يعرض الأنشطة والمشاريع المنجزة والتقرير المالي لجمعية تيفاوين.",
          en: "Annual report presenting the activities, completed projects and financial balance of the Tifaouine association."
        },
        couverture: '/data/ressources/images/documents/couvertures/3.png'
      },
      {
        file: 'gantt projet 5.pdf',
        type: 'document',
        titre: { fr: "Planning Gantt Projet 5", ar: "مخطط غانت للمشروع 5", en: "Gantt Chart Project 5" },
        desc: { fr: "Planning temporel du projet 5.", ar: "التخطيط الزمني للمشروع 5.", en: "Time planning for project 5." },
        couverture: '/data/ressources/images/documents/couvertures/17.png'
      },
      {
        file: 'gantt projet 5_v2.pdf',
        type: 'document',
        titre: { fr: "Planning Gantt Projet 5 v2", ar: "مخطط غانت للمشروع 5 النسخة 2", en: "Gantt Chart Project 5 v2" },
        desc: { fr: "Version mise à jour du planning du projet 5.", ar: "نسخة محينة لتخطيط المشروع 5.", en: "Updated version of project 5 planning." },
        couverture: '/data/ressources/images/documents/couvertures/18.png'
      },
      {
        file: 'r-1776551479864-683160.pdf',
        type: 'rapport',
        titre: { fr: "Rapport de Ressources", ar: "تقرير الموارد", en: "Resource Report" },
        desc: { fr: "Document de synthèse des ressources.", ar: "وثيقة ملخصة للموارد.", en: "Summary resource document." },
        couverture: '/data/ressources/images/documents/couvertures/19.jpg'
      },
      {
        file: 'r-1776552865489-84822.pdf',
        type: 'rapport',
        titre: { fr: "Rapport d'activité 2025", ar: "تقرير النشاط 2025", en: "Activity Report 2025" },
        desc: { fr: "Bilan des activités de l'année 2025.", ar: "حصيلة أنشطة سنة 2025.", en: "Review of activities for the year 2025." },
        couverture: '/data/ressources/images/documents/couvertures/20.jpg'
      }
    ];

    documentsConfig.forEach(cfg => {
      const filePath = path.join(DOCS_BASE, cfg.file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const ext = path.extname(cfg.file).toLowerCase().replace('.', '');

        allRessources.push({
          projet_id:        null,
          evenement_id:     null,
          type:             cfg.type,
          url:              `/data/ressources/documents/${cfg.file}`,
          nom_original:     cfg.file,
          titre_fr:         cfg.titre.fr,
          titre_ar:         cfg.titre.ar,
          titre_en:         cfg.titre.en,
          description_fr:   cfg.desc.fr,
          description_ar:   cfg.desc.ar,
          description_en:   cfg.desc.en,
          file_size:        stats.size,
          file_type:        ext,
          image_couverture: cfg.couverture || null,
          is_featured:      cfg.is_featured || false,
          created_at:       dateUpload,
          updated_at:       dateUpload
        });
      }
    });

    // ─── Insertion ───────────────────────────────────────────────────────────
    if (allRessources.length > 0) {
      await queryInterface.bulkInsert('ressource', allRessources);
      console.log(`✅ ${allRessources.length} ressources insérées (images + documents).`);
    } else {
      console.warn('⚠️ Aucune ressource trouvée. Vérifiez les dossiers.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ressource', {
      url: { 
        [Sequelize.Op.or]: [
          { [Sequelize.Op.like]: '/data/ressources/images/%' },
          { [Sequelize.Op.like]: '/data/ressources/documents/%' }
        ]
      }
    }, {});
  }
};
