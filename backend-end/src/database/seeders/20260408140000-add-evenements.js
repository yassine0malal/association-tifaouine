'use strict';

// NOTE : Ce seeder doit être exécuté APRÈS les seeders des domaines et projets.
// Les dates exactes de réalisation ne sont pas connues.
// date_debut est fixée à la date de création de l'association (1998-01-01) par défaut.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. Récupérer les domaines
    const [domaines] = await queryInterface.sequelize.query(
      `SELECT id, nom_fr FROM domaine`
    );
    const D = {};
    domaines.forEach(d => { D[d.nom_fr] = d.id; });

    // 2. Vérifier que tous les domaines nécessaires existent
    const domainesRequis = [
      'Communication et partenariats',
      'Développement agricole',
      'Protection de l\'environnement',
      'Santé',
      'Éducation et formation',
      'Club féminin et autonomisation'
    ];
    for (const nom of domainesRequis) {
      if (!D[nom]) throw new Error(`Domaine introuvable : "${nom}" — vérifiez le seeder des domaines.`);
    }

    // 3. Récupérer les projets
    const [projets] = await queryInterface.sequelize.query(
      `SELECT id, titre_fr FROM projet`
    );
    const P = {};
    projets.forEach(p => { P[p.titre_fr] = p.id; });

    // Date par défaut : date de création de l'association
    const DATE_DEFAUT = new Date('1998-01-01');
    const now = new Date();

    const evenements = [

      // ── VISITES REÇUES ──────────────────────────────────────────────────────

      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'زيارة كاتب الدولة المكلف بالتنمية القروية',
        titre_fr:       'Visite du Secrétaire d\'État chargé du Développement Rural',
        titre_en:       'Visit of the Secretary of State for Rural Development',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'زيارة رسمية على المستوى الوطني لكاتب الدولة المكلف بالتنمية القروية لمقر جمعية تيفاوين للاطلاع على مشاريعها وأنشطتها.',
        description_fr: 'Visite officielle au niveau national du Secrétaire d\'État chargé du Développement Rural au siège de l\'association Tifaouine pour découvrir ses projets et activités.',
        description_en: 'Official national-level visit of the Secretary of State for Rural Development to the Tifaouine association headquarters to learn about its projects and activities.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'زيارة عامل صاحب الجلالة على إقليم الحوز',
        titre_fr:       'Visite du Gouverneur de la Province du Haouz',
        titre_en:       'Visit of the Governor of the Province of Haouz',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'زيارة رسمية على المستوى الجهوي لعامل صاحب الجلالة على إقليم الحوز لمقر جمعية تيفاوين.',
        description_fr: 'Visite officielle au niveau régional du Gouverneur de la Province du Haouz au siège de l\'association Tifaouine.',
        description_en: 'Official regional-level visit of the Governor of the Province of Haouz to the Tifaouine association headquarters.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'زيارة وزير الفلاحة الإسباني وحاكم منطقة الأندلس',
        titre_fr:       'Visite du Ministre de l\'Agriculture espagnol et du Gouverneur d\'Andalousie',
        titre_en:       'Visit of the Spanish Minister of Agriculture and Governor of Andalusia',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'زيارة رسمية دولية لوزير الفلاحة الإسباني وحاكم منطقة الأندلس لمقر جمعية تيفاوين في إطار التعاون الدولي.',
        description_fr: 'Visite officielle internationale du Ministre de l\'Agriculture espagnol et du Gouverneur d\'Andalousie au siège de l\'association Tifaouine dans le cadre de la coopération internationale.',
        description_en: 'International official visit of the Spanish Minister of Agriculture and Governor of Andalusia to the Tifaouine association headquarters within the framework of international cooperation.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'استقبال وفود المجتمع المدني الوطني والدولي',
        titre_fr:       'Accueil de délégations de la société civile nationale et internationale',
        titre_en:       'Reception of national and international civil society delegations',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'استقبال متعدد لوفود من المجتمع المدني الوطني والدولي للاطلاع على تجربة جمعية تيفاوين في مجال التنمية القروية.',
        description_fr: 'Accueil multiple de délégations de la société civile nationale et internationale pour découvrir l\'expérience de l\'association Tifaouine en matière de développement rural.',
        description_en: 'Multiple receptions of national and international civil society delegations to discover the Tifaouine association\'s experience in rural development.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'استقبال وفد من الصحراء المغربية برئاسة برلمانيي المنطقة',
        titre_fr:       'Accueil d\'une délégation du Sahara marocain conduite par des parlementaires',
        titre_en:       'Reception of a delegation from the Moroccan Sahara led by regional parliamentarians',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'استقبال وفد من الصحراء المغربية برئاسة برلمانيي المنطقة للاطلاع على تجربة الجمعية في التنمية القروية وتبادل الخبرات.',
        description_fr: 'Accueil d\'une délégation du Sahara marocain conduite par des parlementaires de la région pour découvrir l\'expérience de l\'association et échanger les expertises.',
        description_en: 'Reception of a delegation from the Moroccan Sahara led by regional parliamentarians to discover the association\'s experience and exchange expertise.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'استقبال فلاحي منطقة شفشاون برئاسة رئيس الغرفة الفلاحية وبرلمانيي المنطقة',
        titre_fr:       'Accueil des agriculteurs de Chefchaouen conduits par le président de la Chambre agricole',
        titre_en:       'Reception of Chefchaouen farmers led by the president of the Agricultural Chamber',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'زيارة تبادل خبرات لفلاحي منطقة شفشاون برئاسة رئيس الغرفة الفلاحية وبرلمانيي المنطقة للاستفادة من تجربة جمعية تيفاوين في التنمية الفلاحية.',
        description_fr: 'Visite d\'échange d\'expériences des agriculteurs de la région de Chefchaouen conduits par le président de la Chambre agricole et les parlementaires de la région.',
        description_en: 'Experience exchange visit of farmers from the Chefchaouen region led by the president of the Agricultural Chamber and regional parliamentarians.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'زيارة مدير الصندوق الدولي للتنمية الزراعية',
        titre_fr:       'Visite du Directeur du Fonds International de Développement Agricole (FIDA)',
        titre_en:       'Visit of the Director of the International Fund for Agricultural Development (IFAD)',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'زيارة دولية لمدير الصندوق الدولي للتنمية الزراعية (FIDA) لمقر جمعية تيفاوين في إطار متابعة مشاريع التنمية الفلاحية.',
        description_fr: 'Visite internationale du Directeur du Fonds International de Développement Agricole (FIDA) au siège de l\'association Tifaouine dans le cadre du suivi des projets de développement agricole.',
        description_en: 'International visit of the Director of the International Fund for Agricultural Development (IFAD) to the Tifaouine association headquarters within the framework of monitoring agricultural development projects.'
      },

      // ── PARTICIPATIONS EXTERNES ─────────────────────────────────────────────

      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'زيارة رئيس الجمعية لجمهورية مصر',
        titre_fr:       'Visite du président de l\'association en République d\'Égypte',
        titre_en:       'Visit of the association president to the Republic of Egypt',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Égypte',
        description_ar: 'زيارة رسمية خارجية لرئيس جمعية تيفاوين إلى جمهورية مصر في إطار التبادل والتواصل الدولي مع المنظمات والجمعيات المماثلة.',
        description_fr: 'Visite officielle à l\'étranger du président de l\'association Tifaouine en République d\'Égypte dans le cadre des échanges et de la communication internationale.',
        description_en: 'Official foreign visit of the Tifaouine association president to the Republic of Egypt within the framework of international exchanges and communication.'
      },
      {
        domaine_id:     D['Développement agricole'],
        projet_id:      null,
        titre_ar:       'المعرض الوطني للفلاحة بمكناس',
        titre_fr:       'Salon International de l\'Agriculture de Meknès (SIAM)',
        titre_en:       'International Agricultural Fair of Meknès (SIAM)',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Meknès, Maroc',
        description_ar: 'مشاركة جمعية تيفاوين في المعرض الوطني للفلاحة بمكناس لعرض المنتجات والتجارب الفلاحية المحلية وتبادل الخبرات مع المشاركين.',
        description_fr: 'Participation de l\'association Tifaouine au Salon International de l\'Agriculture de Meknès pour présenter les produits et expériences agricoles locaux.',
        description_en: 'Participation of Tifaouine association in the International Agricultural Fair of Meknès to present local agricultural products and experiences.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'الملتقى الوطني للتنمية القروية بمكناس',
        titre_fr:       'Rencontre nationale sur le développement rural à Meknès',
        titre_en:       'National meeting on rural development in Meknès',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Meknès, Maroc',
        description_ar: 'مشاركة جمعية تيفاوين في الملتقى الوطني للتنمية القروية بمكناس لمناقشة قضايا التنمية القروية وتقاسم التجارب.',
        description_fr: 'Participation de l\'association Tifaouine à la rencontre nationale sur le développement rural à Meknès pour discuter des enjeux et partager les expériences.',
        description_en: 'Participation of Tifaouine association in the national meeting on rural development in Meknès to discuss issues and share experiences.'
      },
      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'المنتدى الوطني للشباب القروي 2000',
        titre_fr:       'Forum national de la jeunesse rurale 2000',
        titre_en:       'National Forum of Rural Youth 2000',
        date_debut:     new Date('2000-01-01'),
        date_fin:       null,
        lieu:           'Bouznika, Maroc',
        description_ar: 'مشاركة جمعية تيفاوين في المنتدى الوطني للشباب القروي ببوزنيقة سنة 2000 لتمثيل الشباب القروي والمشاركة في النقاش الوطني حول قضاياهم.',
        description_fr: 'Participation de l\'association Tifaouine au Forum national de la jeunesse rurale à Bouznika en 2000 pour représenter la jeunesse rurale et participer au débat national.',
        description_en: 'Participation of Tifaouine association in the National Forum of Rural Youth in Bouznika in 2000 to represent rural youth and participate in the national debate.'
      },

      // ── ACTIVITÉS DE SENSIBILISATION ────────────────────────────────────────

      {
        domaine_id:     D['Protection de l\'environnement'],
        projet_id:      null,
        titre_ar:       'حملات تحسيسية للمحافظة على البيئة',
        titre_fr:       'Campagnes de sensibilisation environnementale',
        titre_en:       'Environmental awareness campaigns',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Région d\'Asni',
        description_ar: 'حملات تحسيسية متكررة للمحافظة على البيئة الطبيعية في منطقة آسني تستهدف الساكنة المحلية والشباب للتوعية بأهمية حماية الموارد الطبيعية.',
        description_fr: 'Campagnes de sensibilisation répétées pour la protection de l\'environnement naturel dans la région d\'Asni, ciblant la population locale et les jeunes.',
        description_en: 'Repeated awareness campaigns for the protection of the natural environment in the Asni region, targeting the local population and youth.'
      },
      {
        domaine_id:     D['Santé'],
        projet_id:      null,
        titre_ar:       'حملات تحسيسية في المجال الصحي',
        titre_fr:       'Campagnes de sensibilisation sanitaire',
        titre_en:       'Health awareness campaigns',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Région d\'Asni',
        description_ar: 'حملات تحسيسية متكررة في المجال الصحي تستهدف ساكنة منطقة آسني للتوعية بأهمية النظافة والوقاية من الأمراض والرعاية الصحية الأولية.',
        description_fr: 'Campagnes de sensibilisation répétées dans le domaine de la santé ciblant la population de la région d\'Asni pour les sensibiliser à l\'hygiène et à la prévention.',
        description_en: 'Repeated health awareness campaigns targeting the population of the Asni region to raise awareness of hygiene and disease prevention.'
      },
      {
        domaine_id:     D['Santé'],
        projet_id:      null,
        titre_ar:       'حملات طبية',
        titre_fr:       'Caravanes médicales',
        titre_en:       'Medical caravans',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Région d\'Asni',
        description_ar: 'تنظيم حملات طبية متكررة لتقديم الرعاية الصحية المجانية لساكنة منطقة آسني في مختلف التخصصات الطبية.',
        description_fr: 'Organisation de caravanes médicales répétées pour fournir des soins de santé gratuits à la population de la région d\'Asni dans diverses spécialités médicales.',
        description_en: 'Organisation of repeated medical caravans to provide free health care to the population of the Asni region in various medical specialties.'
      },
      {
        domaine_id:     D['Éducation et formation'],
        projet_id:      null,
        titre_ar:       'برنامج التربية الوالدية',
        titre_fr:       'Programme d\'éducation parentale',
        titre_en:       'Parental education programme',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Asni',
        description_ar: 'برنامج تكويني دوري موجه للآباء والأمهات لتعزيز مهاراتهم في التربية والرعاية الأسرية وتنشئة الأطفال.',
        description_fr: 'Programme de formation périodique destiné aux parents pour renforcer leurs compétences en matière d\'éducation et de soins familiaux.',
        description_en: 'Periodic training programme aimed at parents to strengthen their skills in education and family care.'
      },
      {
        domaine_id:     D['Protection de l\'environnement'],
        projet_id:      null,
        titre_ar:       'التحسيس بالبيئة وتكوين المنشطين البيئيين',
        titre_fr:       'Sensibilisation environnementale et formation des animateurs',
        titre_en:       'Environmental awareness and training of environmental facilitators',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Région d\'Asni',
        description_ar: 'برنامج دوري للتحسيس بالبيئة وتكوين منشطين بيئيين محليين قادرين على نشر ثقافة حماية البيئة في مجتمعاتهم.',
        description_fr: 'Programme périodique de sensibilisation environnementale et de formation d\'animateurs environnementaux locaux capables de diffuser la culture de protection de l\'environnement.',
        description_en: 'Periodic programme of environmental awareness and training of local environmental facilitators capable of spreading the culture of environmental protection.'
      },

      // ── FORMATIONS ORGANISÉES ───────────────────────────────────────────────

      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'تكوينات أعضاء الجمعية',
        titre_fr:       'Formations des membres de l\'association',
        titre_en:       'Training of association members',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Asni',
        description_ar: 'تكوينات دورية لأعضاء جمعية تيفاوين في مجالات التسيير الجمعوي والتخطيط وتدبير المشاريع لتعزيز قدراتهم.',
        description_fr: 'Formations périodiques des membres de l\'association Tifaouine dans les domaines de la gestion associative, de la planification et de la gestion de projets.',
        description_en: 'Periodic training of Tifaouine association members in associative management, planning and project management.'
      },
      {
        domaine_id:     D['Développement agricole'],
        projet_id:      P['Formation des agriculteurs de montagne pour la culture des roses'] || null,
        titre_ar:       'تكوينات الفلاحين في مجالات الفلاحة',
        titre_fr:       'Formations des agriculteurs dans les domaines agricoles',
        titre_en:       'Training of farmers in agricultural fields',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Région d\'Asni',
        description_ar: 'تكوينات متعددة لفلاحي المنطقة في مجالات الزراعة والري والتقليم وتثمين المنتوج المحلي لتحسين إنتاجيتهم ودخلهم.',
        description_fr: 'Formations multiples des agriculteurs de la région dans les domaines de l\'agriculture, de l\'irrigation, de la taille et de la valorisation du produit local.',
        description_en: 'Multiple training sessions for farmers in agriculture, irrigation, pruning and local product enhancement to improve productivity and income.'
      },
      {
        domaine_id:     D['Éducation et formation'],
        projet_id:      P['Soutien à l\'éducation et formation - partenariat avec les écoles'] || null,
        titre_ar:       'دروس الدعم للتلاميذ',
        titre_fr:       'Cours de soutien scolaire',
        titre_en:       'School support classes',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Siège de l\'association, Asni',
        description_ar: 'دروس دعم مجانية لتلاميذ مدارس آسني تُقدَّم في مقر الجمعية لمساعدتهم على تحسين مستواهم الدراسي.',
        description_fr: 'Cours de soutien scolaire gratuits pour les élèves des écoles d\'Asni dispensés au siège de l\'association.',
        description_en: 'Free school support classes for students of Asni schools provided at the association headquarters.'
      },
      {
        domaine_id:     D['Club féminin et autonomisation'],
        projet_id:      P['Club féminin, centre de formation et préscolaire'] || null,
        titre_ar:       'تكوين النساء في النادي النسوي',
        titre_fr:       'Formation des femmes au club féminin',
        titre_en:       'Women\'s training at the women\'s club',
        date_debut:     new Date('2003-01-01'),
        date_fin:       null,
        lieu:           'Club féminin, Asni',
        description_ar: 'تكوينات متنوعة للنساء في النادي النسوي تشمل الخياطة والطبخ ومحو الأمية والحرف التقليدية. عدد المستفيدات من 2003 إلى 2011: 860 امرأة.',
        description_fr: 'Formations variées pour les femmes au club féminin couvrant la couture, la cuisine, l\'alphabétisation et l\'artisanat traditionnel. Nombre de bénéficiaires de 2003 à 2011 : 860 femmes.',
        description_en: 'Varied training for women at the women\'s club covering sewing, cooking, literacy and traditional crafts. Beneficiaries from 2003 to 2011: 860 women.'
      },

      // ── ÉCHANGES INTER-ASSOCIATIFS ──────────────────────────────────────────

      {
        domaine_id:     D['Communication et partenariats'],
        projet_id:      null,
        titre_ar:       'تبادل الزيارات بين الجمعيات والمنظمات الشريكة',
        titre_fr:       'Échanges de visites entre associations et organisations partenaires',
        titre_en:       'Exchange visits between partner associations and organisations',
        date_debut:     DATE_DEFAUT,
        date_fin:       null,
        lieu:           'Maroc et international',
        description_ar: 'تبادل متكرر للزيارات بين جمعية تيفاوين والجمعيات والمنظمات الشريكة الوطنية والدولية لتقاسم الخبرات وتعزيز التعاون.',
        description_fr: 'Échanges répétés de visites entre l\'association Tifaouine et les associations et organisations partenaires nationales et internationales pour partager les expériences.',
        description_en: 'Repeated exchange visits between Tifaouine association and national and international partner associations and organisations to share experiences.'
      }
    ];

    await queryInterface.bulkInsert('evenement',
      evenements.map(e => ({
        ...e,
        image_principale: null,
        created_at: now,
        updated_at: now
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('evenement', null, {});
  }
};
