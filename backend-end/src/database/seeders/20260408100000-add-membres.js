'use strict';

// NOTE : Déposer les photos dans backend-end/src/data/membres/
// avec exactement les noms de fichiers définis ci-dessous avant d'appliquer le seeder.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const dateAdhesion = new Date('2025-05-25');

    // Descriptions des postes : rôle administratif + importance dans le développement de l'association
    const descriptions = {
      'Président': {
        fr: 'Représente l\'association, porte la vision stratégique, noue les partenariats et mobilise les ressources pour concrétiser les projets au service des communautés rurales.',
        ar: 'يمثل الجمعية ويحمل الرؤية الاستراتيجية ويبني الشراكات ويعبئ الموارد لتجسيد المشاريع في خدمة المجتمعات القروية.',
        en: 'Represents the association, carries the strategic vision, builds partnerships and mobilises resources to bring projects to life for rural communities.'
      },
      'Vice-Président': {
        fr: 'Bras droit du Président, assure la coordination opérationnelle, la continuité de l\'action associative et renforce les liens entre les acteurs internes et externes.',
        ar: 'الذراع اليمنى للرئيس، يضمن التنسيق العملي واستمرارية العمل الجمعوي ويعزز الروابط بين الفاعلين الداخليين والخارجيين.',
        en: 'Right hand of the President, ensures operational coordination, continuity of action and strengthens links between internal and external stakeholders.'
      },
      'Secrétaire': {
        fr: 'Mémoire institutionnelle de l\'association, rédige les procès-verbaux, garantit la traçabilité des décisions et assure la transparence de la gouvernance.',
        ar: 'الذاكرة المؤسسية للجمعية، يحرر المحاضر ويضمن تتبع القرارات وشفافية الحوكمة.',
        en: 'Institutional memory of the association, drafts minutes, ensures decision traceability and governance transparency.'
      },
      'Vice-Secrétaire': {
        fr: 'Seconde le Secrétaire Général, gère les archives, assure la fluidité des échanges documentaires et soutient l\'organisation des réunions et événements.',
        ar: 'يساعد الكاتب العام، يدبر الأرشيف ويضمن سلاسة تبادل الوثائق ويدعم تنظيم الاجتماعات والفعاليات.',
        en: 'Assists the General Secretary, manages archives, ensures smooth documentary exchanges and supports organisation of meetings and events.'
      },
      'Trésorier': {
        fr: 'Gardien de la santé financière, gère les comptes et rapports financiers. Une gestion rigoureuse maintient la confiance des partenaires et garantit la pérennité des projets.',
        ar: 'حارس الصحة المالية، يدبر الحسابات والتقارير المالية. التدبير الدقيق يحفظ ثقة الشركاء ويضمن استدامة المشاريع.',
        en: 'Guardian of financial health, manages accounts and financial reports. Rigorous management maintains partner trust and ensures project sustainability.'
      },
      'Vice-Trésorier': {
        fr: 'Assiste le Trésorier, assure la continuité et fiabilité de la gestion financière, renforce le contrôle interne et soutient la transparence envers les partenaires.',
        ar: 'يساعد أمين المال، يضمن استمرارية وموثوقية التدبير المالي ويعزز الرقابة الداخلية والشفافية أمام الشركاء.',
        en: 'Assists the Treasurer, ensures continuity and reliability of financial management, strengthens internal control and supports transparency to partners.'
      }
    };

    const membres = [
      {
        nom:           'Abdelmadjid Ajyar',
        email:         'abdelmadjid.ajyar@tifaouine.com',
        poste:         'Président',
        photo_profile: '/data/membres/abdelmadjid-ajyar.jpg'
      },
      {
        nom:           'Farid Admhaned',
        email:         'farid.admhaned@tifaouine.com',
        poste:         'Vice-Président',
        photo_profile: '/data/membres/farid-admhaned.jpg'
      },
      {
        nom:           'Mohamed Ait Ahmade',
        email:         'mohamed.aitahmade@tifaouine.com',
        poste:         'Secrétaire',
        photo_profile: '/data/membres/mohamed-ait-ahmade.jpg'
      },
      {
        nom:           'Abdelkabir Biraym',
        email:         'abdelkabir.biraym@tifaouine.com',
        poste:         'Vice-Secrétaire',
        photo_profile: '/data/membres/abdelkabir-biraym.jpg'
      },
      {
        nom:           'Lhoucine Boussouka',
        email:         'lhoucine.boussouka@tifaouine.com',
        poste:         'Trésorier',
        photo_profile: '/data/membres/lhoucine-boussouka.jpg'
      },
      {
        nom:           'Abdelkabir Amzilen',
        email:         'abdelkabir.amzilen@tifaouine.com',
        poste:         'Vice-Trésorier',
        photo_profile: '/data/membres/abdelkabir-amzilen.jpg'
      }
    ];

    // 1. Insérer les utilisateurs
    await queryInterface.bulkInsert('utilisateur',
      membres.map(m => ({
        nom:        m.nom,
        email:      m.email,
        type:       'membre',
        created_at: dateAdhesion,
        updated_at: dateAdhesion
      }))
    );

    // 2. Récupérer les IDs insérés par email
    const [rows] = await queryInterface.sequelize.query(
      `SELECT id, email FROM utilisateur WHERE email IN (${membres.map(m => `'${m.email}'`).join(',')})`
    );

    // 3. Mapper email → id
    const emailToId = {};
    rows.forEach(r => { emailToId[r.email] = r.id; });

    // 4. Insérer les profils membre avec descriptions de poste
    await queryInterface.bulkInsert('membre',
      membres.map(m => ({
        utilisateur_id:       emailToId[m.email],
        poste:                m.poste,
        description_poste_fr: descriptions[m.poste].fr,
        description_poste_ar: descriptions[m.poste].ar,
        description_poste_en: descriptions[m.poste].en,
        photo_profile:        m.photo_profile,
        status:               'actif',
        date_adhesion:        dateAdhesion,
        created_at:           dateAdhesion,
        updated_at:           dateAdhesion
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    const emails = [
      'abdelmadjid.ajyar@tifaouine.com',
      'farid.admhaned@tifaouine.com',
      'mohamed.aitahmade@tifaouine.com',
      'abdelkabir.biraym@tifaouine.com',
      'lhoucine.boussouka@tifaouine.com',
      'abdelkabir.amzilen@tifaouine.com'
    ];

    await queryInterface.bulkDelete('utilisateur', {
      email: { [Sequelize.Op.in]: emails }
    }, {});
  }
};
