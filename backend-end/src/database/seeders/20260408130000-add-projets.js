'use strict';

// NOTE : Ce seeder doit être exécuté APRÈS le seeder des domaines (20260408120000-add-domaines.js)

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const [domaines] = await queryInterface.sequelize.query(`SELECT id, nom_fr FROM domaine`);
    const D = {};
    domaines.forEach(d => { D[d.nom_fr] = d.id; });

    const now = new Date();

    const projets = [
      {
        domaine_id:       D['Eau potable'],
        titre_fr:         'Projet Eau Potable',
        titre_ar:         'مشروع الماء الصالح للشرب',
        titre_en:         'Drinking Water Project',
        description_fr:   'Ce projet a été réalisé en trois phases :\n\nPhase 1 : Approfondissement du puits et installation de la pompe et des canalisations.\nPhase 2 : Construction des citernes de distribution.\nPhase 3 : Extension du réseau d\'eau vers le douar Tkadiret et le musée environnemental.',
        description_ar:   'تم إنجاز هذا المشروع في ثلاث مراحل:\n\nالمرحلة الأولى: تعميق البئر وتركيب المضخة والأنابيب.\nالمرحلة الثانية: بناء صهاريج التوزيع.\nالمرحلة الثالثة: تمديد شبكة الماء لدوار تكديرت والمتحف البيئي.',
        description_en:   'This project was completed in three phases:\n\nPhase 1: Well deepening and installation of the pump and pipelines.\nPhase 2: Construction of distribution tanks.\nPhase 3: Extension of the water network to Tkadiret village and the environmental museum.',
        partenaires:      'Association (20%), Ministère de l\'Équipement - Programme PAGER (80%), Province du Haouz, Association Afoulki des femmes de Tahnaout, DPA, Direction Régionale des Eaux et Forêts, ALTER DOMUS',
        statut:           'termine',
        localisation:     'Douar Asni, Douar Tkadiret, Musée environnemental',
        nb_beneficiaires: 450,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       D['Assainissement'],
        titre_fr:         'Projet Assainissement',
        titre_ar:         'مشروع الصرف الصحي',
        titre_en:         'Sanitation Project',
        description_fr:   'Réalisation d\'un réseau d\'assainissement pour améliorer les conditions de vie dans les douars. Le projet a été mis en œuvre avec la contribution des habitants et des partenaires internationaux et locaux pour fournir une infrastructure sanitaire durable.',
        description_ar:   'إنجاز شبكة الصرف الصحي لتحسين ظروف العيش بالدواوير. تم تنفيذ المشروع بمساهمة السكان والشركاء الدوليين والمحليين لتوفير بنية تحتية صحية مستدامة.',
        description_en:   'Implementation of a sanitation network to improve living conditions in the villages. The project was carried out with the contribution of residents and international and local partners to provide sustainable sanitary infrastructure.',
        partenaires:      null,
        statut:           'termine',
        localisation:     'Région d\'Asni',
        nb_beneficiaires: 350,
        date_debut:       null,
        date_fin:         null,
        budget:           212000
      },
      {
        domaine_id:       D['Infrastructure'],
        titre_fr:         'Aménagement et construction du siège de l\'association',
        titre_ar:         'ترميم وبناء مقر الجمعية',
        titre_en:         'Development and construction of the association headquarters',
        description_fr:   'Construction et aménagement du siège principal de l\'association Tifaouine pour servir de centre de coordination des activités et projets et de service à la communauté locale. Le siège comprend des salles polyvalentes, des bureaux administratifs et des installations pour les activités associatives.',
        description_ar:   'بناء وتهيئة المقر الرئيسي لجمعية تيفاوين ليكون مركزاً لتنسيق الأنشطة والمشاريع وخدمة المجتمع المحلي. يضم المقر قاعات متعددة الاستخدامات ومكاتب إدارية ومرافق للأنشطة الجمعوية.',
        description_en:   'Construction and development of the main headquarters of Tifaouine association to serve as a coordination center for activities and projects and to serve the local community. The headquarters includes multipurpose rooms, administrative offices and facilities for association activities.',
        partenaires:      null,
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 0,
        date_debut:       null,
        date_fin:         null,
        budget:           400000
      },
      {
        domaine_id:       D['Éducation et formation'],
        titre_fr:         'Club féminin, centre de formation et préscolaire',
        titre_ar:         'النادي النسوي ومركز التكوين والتعليم الأولي',
        titre_en:         'Women\'s club, training center and preschool',
        description_fr:   'Centre de formation des femmes depuis 2003 et d\'éducation préscolaire depuis 1998. Le centre offre des programmes de formation variés pour les femmes dans les domaines de la couture, de la cuisine, de l\'alphabétisation et de l\'artisanat traditionnel. Nombre de bénéficiaires du centre (2003-2011) : 860 femmes. Nombre de bénéficiaires du préscolaire : 580 enfants à raison de 40 enfants par an.',
        description_ar:   'مركز تكوين النساء منذ 2003 والتعليم الأولي منذ 1998. يوفر المركز برامج تكوينية متنوعة للنساء في مجالات الخياطة والطبخ ومحو الأمية والحرف التقليدية. عدد المستفيدات من المركز (2003-2011): 860 امرأة. عدد المستفيدين من التعليم الأولي: 580 طفلاً بمعدل 40 طفلاً سنوياً.',
        description_en:   'Women\'s training center since 2003 and preschool education since 1998. The center offers various training programs for women in sewing, cooking, literacy and traditional crafts. Number of center beneficiaries (2003-2011): 860 women. Number of preschool beneficiaries: 580 children at a rate of 40 children per year.',
        partenaires:      null,
        statut:           'en_cours',
        localisation:     'Asni',
        nb_beneficiaires: 1440,
        date_debut:       '1998-01-01',
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       D['Éducation et formation'],
        titre_fr:         'Jardin d\'enfants et école coranique',
        titre_ar:         'روض الأطفال ومأوى حفظة القرآن الكريم',
        titre_en:         'Kindergarten and Quranic school',
        description_fr:   'Création d\'un jardin d\'enfants et d\'une école coranique pour offrir une éducation religieuse et sociale aux enfants dans un environnement sûr et stimulant.',
        description_ar:   'إنشاء روض للأطفال ومأوى لحفظة القرآن الكريم لتوفير تعليم ديني واجتماعي للأطفال في بيئة آمنة ومحفزة.',
        description_en:   'Creation of a kindergarten and Quranic school to provide religious and social education to children in a safe and stimulating environment.',
        partenaires:      'Association, Virgin Unite, Ministère des Habous et des Affaires Islamiques, Ordre des Ingénieurs de Marrakech, Ahrram Toubou',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 120,
        date_debut:       null,
        date_fin:         null,
        budget:           1300000
      },
      {
        domaine_id:       D['Infrastructure'],
        titre_fr:         'Projet Hammam Public',
        titre_ar:         'مشروع الحمام العمومي',
        titre_en:         'Public Hammam Project',
        description_fr:   'Après la rénovation du siège de l\'association financée par la première tranche du Ministère de l\'Emploi, et après son équipement par le projet FIDA, l\'association Tifaouine a pris l\'initiative de réorienter le crédit de la deuxième tranche vers la construction du hammam public. Grâce à la réputation acquise par l\'association, et avec l\'appui du Ministère de l\'Agriculture, elle a pu obtenir un chauffe-eau perfectionné pour ce hammam public, considéré comme un modèle dans la région.',
        description_ar:   'بعد ترميم مقر الجمعية بالشطر الأول الممنوح من وزارة التشغيل، وبعدما تم تجهيزه من طرف مشروع FIDA، بادرت جمعية تيفاوين إلى تحويل اعتماد الشطر الثاني إلى بناء الحمام العمومي. ونظراً للسمعة التي عرفتها الجمعية، تمكنت وبفضل وزارة الفلاحة من الحصول على سخانة مائية متطورة للحمام العمومي الذي يعتبر نموذجياً في المنطقة.',
        description_en:   'After the renovation of the association\'s headquarters funded by the first tranche from the Ministry of Employment, and after its equipment by the FIDA project, Tifaouine association redirected the second tranche credit towards the construction of the public hammam. Thanks to the reputation acquired by the association, and with the support of the Ministry of Agriculture, it obtained an advanced solar water heater for this public hammam, considered a model in the region.',
        partenaires:      'Ministère de l\'Emploi (Direction des Affaires Sociales), Projet FIDA, Ministère de l\'Agriculture',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 500,
        date_debut:       null,
        date_fin:         null,
        budget:           450000
      },
      {
        domaine_id:       D['Protection de l\'environnement'],
        titre_fr:         'Alimentation en eau potable du musée environnemental',
        titre_ar:         'تزويد المتحف البيئي بالماء الصالح للشرب',
        titre_en:         'Drinking water supply for the environmental museum',
        description_fr:   'Extension du réseau d\'eau potable au musée environnemental pour soutenir ses activités de sensibilisation et d\'éducation dans le domaine de la protection de l\'environnement et de la biodiversité de la région.',
        description_ar:   'مد شبكة الماء الصالح للشرب للمتحف البيئي لدعم أنشطته التوعوية والتعليمية في مجال حماية البيئة والتنوع البيولوجي بالمنطقة.',
        description_en:   'Extension of the drinking water network to the environmental museum to support its awareness and education activities in the field of environmental protection and regional biodiversity.',
        partenaires:      'Association, Les habitants, Direction Régionale des Eaux et Forêts du Grand Atlas, Société Protectrice des Animaux et de la Nature (SPNA)',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 0,
        date_debut:       null,
        date_fin:         null,
        budget:           179900
      },
      {
        domaine_id:       D['Développement agricole'],
        titre_fr:         'Formation des agriculteurs de montagne pour la culture des roses',
        titre_ar:         'تكوين فلاحي المناطق الجبلية للعناية بالورديات',
        titre_en:         'Training of mountain farmers for rose cultivation',
        description_fr:   'Formation des agriculteurs des zones montagneuses voisines d\'Asni dans le domaine de la culture et de l\'entretien des roses pour diversifier les sources de revenus et valoriser le produit local. La formation a couvert les techniques de culture, d\'irrigation, de taille, de récolte et de commercialisation.',
        description_ar:   'تكوين فلاحي المناطق الجبلية المجاورة لآسني في مجال زراعة ورعاية الورديات لتنويع مصادر الدخل وتثمين المنتوج المحلي. شمل التكوين تقنيات الزراعة والري والتقليم والحصاد والتسويق.',
        description_en:   'Training of farmers in mountainous areas near Asni in rose cultivation and care to diversify income sources and enhance local products. The training covered cultivation, irrigation, pruning, harvesting and marketing techniques.',
        partenaires:      'Direction Provinciale de l\'Agriculture de Marrakech, Direction de la Recherche Agronomique de Marrakech, Fonds Régional de Promotion de l\'Emploi',
        statut:           'termine',
        localisation:     'Région d\'Asni et montagnes avoisinantes',
        nb_beneficiaires: 85,
        date_debut:       null,
        date_fin:         null,
        budget:           30000
      },
      {
        domaine_id:       D['Développement agricole'],
        titre_fr:         'Projet Igran d\'Asni',
        titre_ar:         'مشروع اكران نوسني - Igran d\'Asni',
        titre_en:         'Igran d\'Asni Project',
        description_fr:   'Accompagnement de l\'agriculteur dans son travail pour développer ses capacités et transformer son champ en petite entreprise. Le projet vise à améliorer les pratiques agricoles et à promouvoir l\'entrepreneuriat agricole. La coopérative Tifaouine a été intégrée dans la deuxième phase du projet pour élargir la portée de l\'impact.',
        description_ar:   'مواكبة الفلاح في عمله لتنمية قدراته وجعل حقله مقاولة صغرى. يهدف المشروع إلى تحسين الممارسات الزراعية وتعزيز ريادة الأعمال الفلاحية. أُدرجت تعاونية تيفاوين في الشطر الثاني من المشروع لتوسيع نطاق التأثير.',
        description_en:   'Supporting farmers in their work to develop their capacities and transform their field into a small business. The project aims to improve agricultural practices and promote agricultural entrepreneurship. The Tifaouine cooperative was integrated into the second phase of the project to expand the scope of impact.',
        partenaires:      null,
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 120,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       D['Infrastructure'],
        titre_fr:         'Projets DPA Marrakech - Programme FIDA',
        titre_ar:         'مشاريع المديرية الإقليمية للفلاحة في إطار مشروع FIDA',
        titre_en:         'DPA Marrakech Projects - FIDA Programme',
        description_fr:   'Ensemble de projets réalisés en partenariat avec la Direction Provinciale de l\'Agriculture de Marrakech dans le cadre du programme FIDA comprenant : réhabilitation de ravins pour limiter les inondations, construction d\'une seguia sur 2000 mètres, fourniture de canalisations d\'eau potable à l\'association, fourniture de plants de roses aux agriculteurs, plantation de 17 hectares d\'oliviers en bour, équipements du club féminin et de la section d\'alphabétisation.',
        description_ar:   'مجموعة مشاريع منجزة بشراكة مع المديرية الإقليمية للفلاحة بمراكش في إطار مشروع FIDA تشمل: إصلاح الشعاب للحد من الفيضانات، بناء الساقية على امتداد 2000 متر، تزويد الجمعية بأنابيب الماء الصالح للشرب، تزويد الفلاحين بشتائل الورديات، غرس 17 هكتار بورية بأشجار الزيتون، تجهيزات النادي النسوي وقسم محاربة الأمية.',
        description_en:   'Set of projects carried out in partnership with the Provincial Directorate of Agriculture of Marrakech under the FIDA programme including: ravine rehabilitation to limit flooding, construction of a 2000-meter seguia, provision of drinking water pipes to the association, provision of rose seedlings to farmers, planting of 17 hectares of rainfed olive trees, equipment for the women\'s club and literacy section.',
        partenaires:      'Direction Provinciale de l\'Agriculture de Marrakech (DPA), Programme FIDA',
        statut:           'termine',
        localisation:     'Asni et environs',
        nb_beneficiaires: 600,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       D['Emploi et économie sociale'],
        titre_fr:         'Séchoir de fruits et plantes aromatiques et médicinales',
        titre_ar:         'مشروع مجفف الفواكه والأعشاب الطبية والعطرية',
        titre_en:         'Fruit and aromatic and medicinal plant dryer',
        description_fr:   'Création d\'une unité de séchage de fruits et de plantes aromatiques et médicinales pour valoriser le produit local et créer des sources de revenus durables pour les femmes et les agriculteurs. Le projet contribue à la conservation des produits saisonniers et à leur commercialisation tout au long de l\'année.',
        description_ar:   'إنشاء وحدة لتجفيف الفواكه والأعشاب الطبية والعطرية لتثمين المنتوج المحلي وخلق موارد دخل مستدامة للنساء والفلاحين. يساهم المشروع في الحفاظ على المنتجات الموسمية وتسويقها على مدار السنة.',
        description_en:   'Creation of a drying unit for fruits and aromatic and medicinal plants to enhance local products and create sustainable income sources for women and farmers. The project contributes to preserving seasonal products and marketing them year-round.',
        partenaires:      null,
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 45,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       D['Éducation et formation'],
        titre_fr:         'Soutien à l\'éducation et formation - partenariat avec les écoles',
        titre_ar:         'دعم التربية والتكوين - شراكة مع المدارس',
        titre_en:         'Support for education and training - partnership with schools',
        description_fr:   'Contribution de l\'association au nettoyage du puits, à l\'acquisition d\'une nouvelle pompe à eau potable et à la réparation des canalisations à l\'école centrale d\'Asni (1.500,00 DH). Ouverture du siège pour des cours de soutien aux élèves. Contribution aux travaux de forage pour la maison de l\'étudiante d\'Asni. Contribution à la création du lycée d\'Asni. Construction d\'une salle polyvalente à la circonscription d\'Asni, actuellement utilisée comme jardin d\'enfants. Introduction de dons étrangers pour la maison de l\'étudiante et certaines écoles éloignées.',
        description_ar:   'مساهمة الجمعية في تنقية البئر واقتناء مضخة جديدة للماء الصالح للشرب وإصلاح قنوات الضخ بالمدرسة المركزية بآسني (1.500,00 درهم). فتح مقر الجمعية لدروس الدعم لتلاميذ المدارس. المساهمة في أشغال الحفر لتزويد دار الطالبة بالماء. المساهمة في خلق نواة الثانوية بآسني. بناء قاعة متعددة الاختصاصات تستغل حالياً كروض للأطفال. إدخال هبات أجنبية لدار الطالبة وبعض المدارس النائية.',
        description_en:   'Association\'s contribution to well cleaning, acquisition of a new drinking water pump and repair of pumping pipes at the central school of Asni (1,500.00 MAD). Opening of the headquarters for support classes for school students. Contribution to drilling works to supply the student house of Asni with drinking water. Contribution to the creation of the high school in Asni. Construction of a multipurpose room at the Asni district, currently used as a kindergarten. Introduction of foreign donations for the student house and some remote schools.',
        partenaires:      'Conseil Provincial du Haouz, Circonscription d\'Asni, Association La Rencontre (France)',
        statut:           'en_cours',
        localisation:     'Asni',
        nb_beneficiaires: 320,
        date_debut:       null,
        date_fin:         null,
        budget:           1500
      }
    ];

    await queryInterface.bulkInsert('projet',
      projets.map(p => ({ ...p, created_at: now, updated_at: now }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projet', null, {});
  }
};
