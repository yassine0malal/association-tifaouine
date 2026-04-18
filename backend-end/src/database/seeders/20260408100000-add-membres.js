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
        fr: 'Le Président est la figure centrale de l\'association Tifaouine. Sur le plan administratif, il représente l\'association devant les autorités, exécute les décisions de l\'assemblée générale, préside les réunions, ordonne les dépenses et signe tous les documents officiels. Au-delà de ces attributions formelles, il est le moteur du développement de l\'association : c\'est lui qui porte la vision stratégique, noue les partenariats institutionnels et internationaux, mobilise les ressources et inspire les membres. Son leadership est déterminant dans la capacité de Tifaouine à concrétiser ses projets au service des communautés rurales de la région d\'Asni.',
        ar: 'الرئيس هو الشخصية المحورية في جمعية تيفاوين. على الصعيد الإداري، يمثل الجمعية أمام السلطات الإدارية والقضائية، وينفذ قرارات الجمع العام، ويترأس الاجتماعات، ويأمر بالصرف ويوقع جميع الوثائق الرسمية. وبعيداً عن هذه الصلاحيات الرسمية، فهو المحرك الأساسي لتطور الجمعية: إذ يحمل الرؤية الاستراتيجية، ويبني الشراكات المؤسسية والدولية، ويعبئ الموارد ويلهم الأعضاء. وقيادته حاسمة في قدرة تيفاوين على تجسيد مشاريعها في خدمة المجتمعات القروية بمنطقة آسني.',
        en: 'The President is the central figure of the Tifaouine association. On the administrative side, he represents the association before authorities, executes general assembly decisions, chairs meetings, authorises expenditures and signs all official documents. Beyond these formal duties, he is the driving force behind the association\'s development: he carries the strategic vision, builds institutional and international partnerships, mobilises resources and inspires members. His leadership is decisive in Tifaouine\'s ability to bring its projects to life in service of the rural communities of the Asni region.'
      },
      'Vice-Président': {
        fr: 'Le Vice-Président est le bras droit du Président et son suppléant naturel en cas d\'absence ou d\'empêchement. Il joue un rôle clé dans la coordination opérationnelle des activités de l\'association et veille à la bonne mise en œuvre des décisions du bureau. Son importance dans le développement de Tifaouine réside dans sa capacité à assurer la continuité de l\'action associative, à soutenir les initiatives de terrain et à renforcer les liens entre les différents acteurs internes et externes de l\'association.',
        ar: 'نائب الرئيس هو الذراع اليمنى للرئيس وخليفته الطبيعي في حالة غيابه أو تعذر قيامه بمهامه. ويضطلع بدور محوري في التنسيق العملي لأنشطة الجمعية والسهر على حسن تنفيذ قرارات المكتب. وتكمن أهميته في تطوير تيفاوين في قدرته على ضمان استمرارية العمل الجمعوي، ودعم المبادرات الميدانية، وتعزيز الروابط بين مختلف الفاعلين الداخليين والخارجيين للجمعية.',
        en: 'The Vice-President is the right hand of the President and his natural substitute in case of absence or incapacity. He plays a key role in the operational coordination of the association\'s activities and ensures the proper implementation of bureau decisions. His importance in Tifaouine\'s development lies in his ability to ensure continuity of associative action, support field initiatives and strengthen links between the various internal and external stakeholders of the association.'
      },
      'Secrétaire': {
        fr: 'Le Secrétaire Général est la mémoire institutionnelle de l\'association. Il rédige les procès-verbaux, envoie les convocations, prépare le rapport moral présenté à l\'assemblée générale et tient à jour les registres et listes des adhérents. Son rôle est fondamental pour le développement de Tifaouine car il garantit la traçabilité des décisions, la transparence de la gouvernance et la bonne communication interne. Une gestion rigoureuse du secrétariat est la colonne vertébrale administrative qui permet à l\'association de fonctionner avec cohérence et crédibilité.',
        ar: 'الكاتب العام هو الذاكرة المؤسسية للجمعية. يحرر محاضر الاجتماعات ويوجه الاستدعاءات، ويهيئ التقرير الأدبي الذي يُتلى أمام الجمعية العمومية، ويحفظ السجلات ويضبط لوائح المنخرطين. ودوره أساسي في تطوير تيفاوين لأنه يضمن تتبع القرارات وشفافية الحوكمة وجودة التواصل الداخلي. إن التدبير الدقيق للكتابة هو العمود الفقري الإداري الذي يتيح للجمعية العمل بانسجام ومصداقية.',
        en: 'The General Secretary is the institutional memory of the association. He drafts meeting minutes, sends convocations, prepares the moral report presented to the general assembly and keeps registers and member lists up to date. His role is fundamental to Tifaouine\'s development as he ensures decision traceability, governance transparency and good internal communication. Rigorous secretariat management is the administrative backbone that allows the association to function with coherence and credibility.'
      },
      'Vice-Secrétaire': {
        fr: 'Le Vice-Secrétaire seconde le Secrétaire Général dans toutes ses missions administratives et le remplace en cas d\'absence. Il contribue à la rédaction des documents officiels, à la gestion des archives et au suivi des correspondances. Son rôle dans le développement de l\'association est de renforcer la capacité administrative de Tifaouine, d\'assurer la fluidité des échanges documentaires et de soutenir la bonne organisation des réunions et événements associatifs.',
        ar: 'يساعد نائب الكاتب الكاتبَ العام في جميع مهامه الإدارية وينوب عنه في حالة غيابه. ويساهم في تحرير الوثائق الرسمية وتدبير الأرشيف ومتابعة المراسلات. ودوره في تطوير الجمعية هو تعزيز الطاقة الإدارية لتيفاوين وضمان سلاسة تبادل الوثائق ودعم حسن تنظيم الاجتماعات والفعاليات الجمعوية.',
        en: 'The Vice-Secretary assists the General Secretary in all his administrative duties and replaces him in case of absence. He contributes to drafting official documents, managing archives and monitoring correspondence. His role in the association\'s development is to strengthen Tifaouine\'s administrative capacity, ensure smooth documentary exchanges and support the good organisation of meetings and associative events.'
      },
      'Trésorier': {
        fr: 'Le Trésorier est le gardien de la santé financière de l\'association. Il gère les affaires financières, contrôle les comptes, tient les listes des adhérents et élabore les rapports financiers. Il supervise le compte bancaire ouvert au nom de l\'association. Son rôle est stratégique pour le développement de Tifaouine : une gestion financière rigoureuse et transparente est la condition sine qua non pour maintenir la confiance des partenaires institutionnels et internationaux, accéder aux financements et garantir la pérennité des projets au bénéfice des populations rurales.',
        ar: 'أمين المال هو حارس الصحة المالية للجمعية. يتولى تدبير الشؤون المالية ومراقبة الحسابات وضبط لوائح المنخرطين وإعداد التقارير المالية، ويشرف على الحساب البنكي المفتوح باسم الجمعية. ودوره استراتيجي في تطوير تيفاوين: فالتدبير المالي الدقيق والشفاف هو الشرط الأساسي للحفاظ على ثقة الشركاء المؤسسيين والدوليين، والحصول على التمويلات، وضمان استدامة المشاريع لفائدة الساكنة القروية.',
        en: 'The Treasurer is the guardian of the association\'s financial health. He manages financial affairs, controls accounts, maintains member lists and prepares financial reports. He supervises the bank account opened in the name of the association. His role is strategic for Tifaouine\'s development: rigorous and transparent financial management is the prerequisite for maintaining the trust of institutional and international partners, accessing funding and ensuring the sustainability of projects for the benefit of rural populations.'
      },
      'Vice-Trésorier': {
        fr: 'Le Vice-Trésorier assiste le Trésorier dans la gestion financière de l\'association et le remplace en cas d\'absence ou d\'empêchement. Il contribue au suivi des dépenses, à la vérification des comptes et à la préparation des bilans financiers. Son rôle dans le développement de Tifaouine est d\'assurer la continuité et la fiabilité de la gestion financière, de renforcer le contrôle interne et de soutenir la capacité de l\'association à rendre compte de manière transparente à ses partenaires et bénéficiaires.',
        ar: 'يساعد نائب أمين المال أمينَ المال في التدبير المالي للجمعية وينوب عنه في حالة غيابه أو تعذر قيامه بمهامه. ويساهم في متابعة النفقات ومراجعة الحسابات وإعداد الميزانيات المالية. ودوره في تطوير تيفاوين هو ضمان استمرارية وموثوقية التدبير المالي، وتعزيز الرقابة الداخلية، ودعم قدرة الجمعية على المساءلة الشفافة أمام شركائها ومستفيديها.',
        en: 'The Vice-Treasurer assists the Treasurer in the financial management of the association and replaces him in case of absence or incapacity. He contributes to expense monitoring, account verification and preparation of financial statements. His role in Tifaouine\'s development is to ensure continuity and reliability of financial management, strengthen internal control and support the association\'s capacity to report transparently to its partners and beneficiaries.'
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
