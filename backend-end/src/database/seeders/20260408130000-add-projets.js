'use strict';

// NOTE : Ce seeder doit être exécuté APRÈS le seeder des domaines (20260408120000-add-domaines.js)
// car il référence les domaine_id

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. Récupérer les IDs des domaines depuis la base
    const [domaines] = await queryInterface.sequelize.query(
      `SELECT id, nom_fr FROM domaine`
    );

    // Mapper nom_fr → id pour faciliter l'assignation
    const domaineMap = {};
    domaines.forEach(d => { domaineMap[d.nom_fr] = d.id; });

    const now = new Date();

    const projets = [
      {
        domaine_id:       domaineMap['Eau potable'],
        titre_fr:         'Projet Eau Potable',
        titre_ar:         'مشروع الماء الصالح للشرب',
        titre_en:         'Drinking Water Project',
        description_ar:   'تم إنجاز هذا المشروع في ثلاث مراحل:\n\nالمرحلة الأولى: تعميق البئر وتركيب المضخة والأنابيب.\nالمرحلة الثانية: بناء صهاريج التوزيع.\nالمرحلة الثالثة: تمديد شبكة الماء لدوار تكديرت والمتحف البيئي.\n\nالشركاء:\n- الجمعية: 20% من التكلفة الإجمالية.\n- وزارة التجهيز: 80% ضمن برنامج PAGER.\n- عمالة إقليم الحوز: تعميق البئر + المضخة + الأنابيب.\n- جمعية أفولكي للنساء بتحناوت: مبلغ 40.000,00 درهم لبناء صهريج ثانٍ.\n- DPA: مضخة وأنابيب التوزيع.\n- المديرية الجهوية للمياه والغابات: صهريج ثالث يستفيد منه دوار تكديرت والمتحف البيئي.\n- شركة التير دوموس (ALTER DOMUS): مضخة 17 فرس.',
        description_fr:   'Ce projet a été réalisé en trois phases :\n\nPhase 1 : Approfondissement du puits et installation de la pompe et des canalisations.\nPhase 2 : Construction des citernes de distribution.\nPhase 3 : Extension du réseau d\'eau vers le douar Tkadiret et le musée environnemental.\n\nPartenaires :\n- L\'association : 20% du coût total.\n- Ministère de l\'Équipement : 80% dans le cadre du programme PAGER.\n- Province du Haouz : approfondissement du puits + pompe + canalisations.\n- Association Afoulki des femmes de Tahnaout : 40.000,00 DH pour la construction d\'une deuxième citerne.\n- DPA : pompe et canalisations de distribution.\n- Direction Régionale des Eaux et Forêts : troisième citerne au profit du douar Tkadiret et du musée environnemental.\n- Société ALTER DOMUS : pompe de 17 chevaux.',
        description_en:   'This project was completed in three phases:\n\nPhase 1: Well deepening and installation of the pump and pipelines.\nPhase 2: Construction of distribution tanks.\nPhase 3: Extension of the water network to Tkadiret village and the environmental museum.\n\nPartners:\n- The association: 20% of the total cost.\n- Ministry of Equipment: 80% under the PAGER programme.\n- Province of Haouz: well deepening + pump + pipelines.\n- Afoulki Women\'s Association of Tahnaout: 40,000.00 MAD for the construction of a second tank.\n- DPA: pump and distribution pipelines.\n- Regional Directorate of Water and Forests: third tank benefiting Tkadiret village and the environmental museum.\n- ALTER DOMUS company: 17-horsepower pump.',
        statut:           'termine',
        localisation:     'Douar Asni, Douar Tkadiret, Musée environnemental',
        nb_beneficiaires: 450,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       domaineMap['Assainissement'],
        titre_fr:         'Projet Assainissement',
        titre_ar:         'مشروع الصرف الصحي',
        titre_en:         'Sanitation Project',
        description_ar:   'إنجاز شبكة الصرف الصحي لتحسين ظروف العيش بالدواوير. تم تنفيذ المشروع بمساهمة السكان والشركاء الدوليين والمحليين لتوفير بنية تحتية صحية مستدامة.',
        description_fr:   'Réalisation d\'un réseau d\'assainissement pour améliorer les conditions de vie dans les douars. Le projet a été mis en œuvre avec la contribution des habitants et des partenaires internationaux et locaux pour fournir une infrastructure sanitaire durable.',
        description_en:   'Implementation of a sanitation network to improve living conditions in the villages. The project was carried out with the contribution of residents and international and local partners to provide sustainable sanitary infrastructure.',
        statut:           'termine',
        localisation:     'Région d\'Asni',
        nb_beneficiaires: 350,
        date_debut:       null,
        date_fin:         null,
        budget:           212000
      },
      {
        domaine_id:       domaineMap['Infrastructure'],
        titre_fr:         'Aménagement et construction du siège de l\'association',
        titre_ar:         'ترميم وبناء مقر الجمعية',
        titre_en:         'Development and construction of the association headquarters',
        description_ar:   'بناء وتهيئة المقر الرئيسي لجمعية تيفاوين ليكون مركزاً لتنسيق الأنشطة والمشاريع وخدمة المجتمع المحلي. يضم المقر قاعات متعددة الاستخدامات ومكاتب إدارية ومرافق للأنشطة الجمعوية.',
        description_fr:   'Construction et aménagement du siège principal de l\'association Tifaouine pour servir de centre de coordination des activités et projets et de service à la communauté locale. Le siège comprend des salles polyvalentes, des bureaux administratifs et des installations pour les activités associatives.',
        description_en:   'Construction and development of the main headquarters of Tifaouine association to serve as a coordination center for activities and projects and to serve the local community. The headquarters includes multipurpose rooms, administrative offices and facilities for association activities.',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 0,
        date_debut:       null,
        date_fin:         null,
        budget:           400000
      },
      {
        domaine_id:       domaineMap['Éducation et formation'],
        titre_fr:         'Club féminin, centre de formation et préscolaire',
        titre_ar:         'النادي النسوي ومركز التكوين والتعليم الأولي',
        titre_en:         'Women\'s club, training center and preschool',
        description_ar:   'مركز تكوين النساء منذ 2003 والتعليم الأولي منذ 1998. يوفر المركز برامج تكوينية متنوعة للنساء في مجالات الخياطة والطبخ ومحو الأمية والحرف التقليدية. عدد المستفيدات من المركز (2003-2011): 860 امرأة. عدد المستفيدين من التعليم الأولي: 580 طفلاً بمعدل 40 طفلاً سنوياً.',
        description_fr:   'Centre de formation des femmes depuis 2003 et d\'éducation préscolaire depuis 1998. Le centre offre des programmes de formation variés pour les femmes dans les domaines de la couture, de la cuisine, de l\'alphabétisation et de l\'artisanat traditionnel. Nombre de bénéficiaires du centre (2003-2011) : 860 femmes. Nombre de bénéficiaires du préscolaire : 580 enfants à raison de 40 enfants par an.',
        description_en:   'Women\'s training center since 2003 and preschool education since 1998. The center offers various training programs for women in sewing, cooking, literacy and traditional crafts. Number of center beneficiaries (2003-2011): 860 women. Number of preschool beneficiaries: 580 children at a rate of 40 children per year.',
        statut:           'en_cours',
        localisation:     'Asni',
        nb_beneficiaires: 1440,
        date_debut:       '1998-01-01',
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       domaineMap['Éducation et formation'],
        titre_fr:         'Jardin d\'enfants et école coranique',
        titre_ar:         'روض الأطفال ومأوى حفظة القرآن الكريم',
        titre_en:         'Kindergarten and Quranic school',
        description_ar:   'إنشاء روض للأطفال ومأوى لحفظة القرآن الكريم لتوفير تعليم ديني واجتماعي للأطفال في بيئة آمنة ومحفزة.\n\nالشركاء:\n- الجمعية\n- جمعية فرجين اونايت\n- وزارة الأوقاف والشؤون الإسلامية\n- هيئة المهندسين بمراكش\n- أهرام طوبو',
        description_fr:   'Création d\'un jardin d\'enfants et d\'une école coranique pour offrir une éducation religieuse et sociale aux enfants dans un environnement sûr et stimulant.\n\nPartenaires :\n- L\'association\n- Virgin Unite\n- Ministère des Habous et des Affaires Islamiques\n- Ordre des Ingénieurs de Marrakech\n- Ahrram Toubou',
        description_en:   'Creation of a kindergarten and Quranic school to provide religious and social education to children in a safe and stimulating environment.\n\nPartners:\n- The association\n- Virgin Unite\n- Ministry of Islamic Affairs\n- Order of Engineers of Marrakech\n- Ahrram Toubou',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 120,
        date_debut:       null,
        date_fin:         null,
        budget:           1300000
      },
      {
        domaine_id:       domaineMap['Infrastructure'],
        titre_fr:         'Projet Hammam Public',
        titre_ar:         'مشروع الحمام العمومي',
        titre_en:         'Public Hammam Project',
        description_ar:   'بعد ترميم مقر الجمعية بالشطر الأول الممنوح من وزارة التشغيل، وبعدما تم تجهيزه من طرف مشروع FIDA، بادرت جمعية تيفاوين إلى تحويل اعتماد الشطر الثاني من ميزانية وزارة التشغيل (مديرية الشؤون الاجتماعية) إلى بناء الحمام العمومي. وبهذا يكون مشروع FIDA مساهماً بطريقة أو بأخرى بشكل مباشر في هذا المشروع الهام. ونظراً للسمعة التي عرفتها الجمعية، تمكنت وبفضل وزارة الفلاحة من الحصول على سخانة مائية متطورة للحمام العمومي الذي يعتبر نموذجياً في المنطقة.',
        description_fr:   'Après la rénovation du siège de l\'association financée par la première tranche du Ministère de l\'Emploi, et après son équipement par le projet FIDA, l\'association Tifaouine a pris l\'initiative de réorienter le crédit de la deuxième tranche du budget du Ministère de l\'Emploi (Direction des Affaires Sociales) vers la construction du hammam public. Ainsi, le projet FIDA a contribué directement ou indirectement à ce projet important. Grâce à la réputation acquise par l\'association, et avec l\'appui du Ministère de l\'Agriculture, elle a pu obtenir un chauffe-eau  perfectionné pour ce hammam public, considéré comme un modèle dans la région.',
        description_en:   'After the renovation of the association\'s headquarters funded by the first tranche from the Ministry of Employment, and after its equipment by the FIDA project, Tifaouine association took the initiative to redirect the second tranche credit from the Ministry of Employment (Social Affairs Directorate) budget towards the construction of the public hammam. Thus, the FIDA project contributed directly or indirectly to this important project. Thanks to the reputation acquired by the association, and with the support of the Ministry of Agriculture, it was able to obtain an advanced solar water heater for this public hammam, considered a model in the region.',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 500,
        date_debut:       null,
        date_fin:         null,
        budget:           450000
      },
      {
        domaine_id:       domaineMap['Protection de l\'environnement'],
        titre_fr:         'Alimentation en eau potable du musée environnemental',
        titre_ar:         'تزويد المتحف البيئي بالماء الصالح للشرب',
        titre_en:         'Drinking water supply for the environmental museum',
        description_ar:   'مد شبكة الماء الصالح للشرب للمتحف البيئي لدعم أنشطته التوعوية والتعليمية في مجال حماية البيئة والتنوع البيولوجي بالمنطقة.\n\nالشركاء:\n- الجمعية\n- السكان\n- المديرية الجهوية للمياه والغابات الأطلس الكبير\n- جمعية الرفق بالحيوان والمحافظة على الطبيعة (SPNA)',
        description_fr:   'Extension du réseau d\'eau potable au musée environnemental pour soutenir ses activités de sensibilisation et d\'éducation dans le domaine de la protection de l\'environnement et de la biodiversité de la région.\n\nPartenaires :\n- L\'association\n- Les habitants\n- Direction Régionale des Eaux et Forêts du Grand Atlas\n- Société Protectrice des Animaux et de la Nature (SPNA)',
        description_en:   'Extension of the drinking water network to the environmental museum to support its awareness and education activities in the field of environmental protection and regional biodiversity.\n\nPartners:\n- The association\n- The residents\n- Regional Directorate of Water and Forests of the Grand Atlas\n- Society for the Protection of Animals and Nature (SPNA)',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 0,
        date_debut:       null,
        date_fin:         null,
        budget:           179900
      },
      {
        domaine_id:       domaineMap['Développement agricole'],
        titre_fr:         'Formation des agriculteurs de montagne pour la culture des roses',
        titre_ar:         'تكوين فلاحي المناطق الجبلية للعناية بالورديات',
        titre_en:         'Training of mountain farmers for rose cultivation',
        description_ar:   'تكوين فلاحي المناطق الجبلية المجاورة لآسني في مجال زراعة ورعاية الورديات لتنويع مصادر الدخل وتثمين المنتوج المحلي. شمل التكوين تقنيات الزراعة والري والتقليم والحصاد والتسويق.\n\nالشركاء:\n- المديرية الإقليمية للفلاحة بمراكش\n- مديرية البحث الزراعي بمراكش\n- الصندوق الجهوي لإنعاش الشغل',
        description_fr:   'Formation des agriculteurs des zones montagneuses voisines d\'Asni dans le domaine de la culture et de l\'entretien des roses pour diversifier les sources de revenus et valoriser le produit local. La formation a couvert les techniques de culture, d\'irrigation, de taille, de récolte et de commercialisation.\n\nPartenaires :\n- Direction Provinciale de l\'Agriculture de Marrakech\n- Direction de la Recherche Agronomique de Marrakech\n- Fonds Régional de Promotion de l\'Emploi',
        description_en:   'Training of farmers in mountainous areas near Asni in rose cultivation and care to diversify income sources and enhance local products. The training covered cultivation, irrigation, pruning, harvesting and marketing techniques.\n\nPartners:\n- Provincial Directorate of Agriculture of Marrakech\n- Directorate of Agronomic Research of Marrakech\n- Regional Employment Promotion Fund',
        statut:           'termine',
        localisation:     'Région d\'Asni et montagnes avoisinantes',
        nb_beneficiaires: 85,
        date_debut:       null,
        date_fin:         null,
        budget:           30000
      },
      {
        domaine_id:       domaineMap['Développement agricole'],
        titre_fr:         'Projet Igran d\'Asni',
        titre_ar:         'مشروع اكران نوسني - Igran d\'Asni',
        titre_en:         'Igran d\'Asni Project',
        description_ar:   'مواكبة الفلاح في عمله لتنمية قدراته وجعل حقله مقاولة صغرى. يهدف المشروع إلى تحسين الممارسات الزراعية وتعزيز ريادة الأعمال الفلاحية. أُدرجت تعاونية تيفاوين في الشطر الثاني من المشروع لتوسيع نطاق التأثير.',
        description_fr:   'Accompagnement de l\'agriculteur dans son travail pour développer ses capacités et transformer son champ en petite entreprise. Le projet vise à améliorer les pratiques agricoles et à promouvoir l\'entrepreneuriat agricole. La coopérative Tifaouine a été intégrée dans la deuxième phase du projet pour élargir la portée de l\'impact.',
        description_en:   'Supporting farmers in their work to develop their capacities and transform their field into a small business. The project aims to improve agricultural practices and promote agricultural entrepreneurship. The Tifaouine cooperative was integrated into the second phase of the project to expand the scope of impact.',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 120,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       domaineMap['Infrastructure'],
        titre_fr:         'Projets DPA Marrakech - Programme FIDA',
        titre_ar:         'مشاريع المديرية الإقليمية للفلاحة في إطار مشروع FIDA',
        titre_en:         'DPA Marrakech Projects - FIDA Programme',
        description_ar:   'مجموعة مشاريع منجزة بشراكة مع المديرية الإقليمية للفلاحة بمراكش في إطار مشروع FIDA تشمل: إصلاح الشعاب للحد من الفيضانات، بناء الساقية على امتداد 2000 متر، تزويد الجمعية بأنابيب الماء الصالح للشرب، تزويد الفلاحين بشتائل الورديات، غرس 17 هكتار بورية بأشجار الزيتون، تجهيزات النادي النسوي وقسم محاربة الأمية.',
        description_fr:   'Ensemble de projets réalisés en partenariat avec la Direction Provinciale de l\'Agriculture de Marrakech dans le cadre du programme FIDA comprenant : réhabilitation de ravins pour limiter les inondations, construction d\'une seguia sur 2000 mètres, fourniture de canalisations d\'eau potable à l\'association, fourniture de plants de roses aux agriculteurs, plantation de 17 hectares d\'oliviers en bour, équipements du club féminin et de la section d\'alphabétisation.',
        description_en:   'Set of projects carried out in partnership with the Provincial Directorate of Agriculture of Marrakech under the FIDA programme including: ravine rehabilitation to limit flooding, construction of a 2000-meter seguia, provision of drinking water pipes to the association, provision of rose seedlings to farmers, planting of 17 hectares of rainfed olive trees, equipment for the women\'s club and literacy section.',
        statut:           'termine',
        localisation:     'Asni et environs',
        nb_beneficiaires: 600,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       domaineMap['Emploi et économie sociale'],
        titre_fr:         'Séchoir de fruits et plantes aromatiques et médicinales',
        titre_ar:         'مشروع مجفف الفواكه والأعشاب الطبية والعطرية',
        titre_en:         'Fruit and aromatic and medicinal plant dryer',
        description_ar:   'إنشاء وحدة لتجفيف الفواكه والأعشاب الطبية والعطرية لتثمين المنتوج المحلي وخلق موارد دخل مستدامة للنساء والفلاحين. يساهم المشروع في الحفاظ على المنتجات الموسمية وتسويقها على مدار السنة.',
        description_fr:   'Création d\'une unité de séchage de fruits et de plantes aromatiques et médicinales pour valoriser le produit local et créer des sources de revenus durables pour les femmes et les agriculteurs. Le projet contribue à la conservation des produits saisonniers et à leur commercialisation tout au long de l\'année.',
        description_en:   'Creation of a drying unit for fruits and aromatic and medicinal plants to enhance local products and create sustainable income sources for women and farmers. The project contributes to preserving seasonal products and marketing them year-round.',
        statut:           'termine',
        localisation:     'Asni',
        nb_beneficiaires: 45,
        date_debut:       null,
        date_fin:         null,
        budget:           0
      },
      {
        domaine_id:       domaineMap['Éducation et formation'],
        titre_fr:         'Soutien à l\'éducation et formation - partenariat avec les écoles',
        titre_ar:         'دعم التربية والتكوين - شراكة مع المدارس',
        titre_en:         'Support for education and training - partnership with schools',
        description_ar:   'مساهمة الجمعية في تنقية البئر واقتناء مضخة جديدة للماء الصالح للشرب وإصلاح قنوات الضخ بالمدرسة المركزية بآسني بمبلغ: 1.500,00 درهم.\nفتح مقر الجمعية لدروس الدعم لتلاميذ المدارس بآسني.\nالمساهمة في أشغال الحفر لتزويد دار الطالبة بآسني بالماء الصالح للشرب.\nالمساهمة في خلق نواة الثانوية بآسني.\nبناء قاعة متعددة الاختصاصات بمركزية آسني وتستغل حالياً كروض للأطفال.\nإدخال هبات أجنبية لدار الطالبة بآسني وبعض المدارس النائية.\n\nالشركاء:\n- المجلس الإقليمي للحوز\n- مركزية آسني\n- جمعية La Rencontre الفرنسية',
        description_fr:   'Contribution de l\'association au nettoyage du puits, à l\'acquisition d\'une nouvelle pompe à eau potable et à la réparation des canalisations de pompage à l\'école centrale d\'Asni pour un montant de 1.500,00 DH.\nOuverture du siège de l\'association pour des cours de soutien aux élèves des écoles d\'Asni.\nContribution aux travaux de forage pour l\'approvisionnement en eau potable de la maison de l\'étudiante d\'Asni.\nContribution à la création du noyau du lycée d\'Asni.\nConstruction d\'une salle polyvalente à la circonscription d\'Asni, actuellement utilisée comme jardin d\'enfants.\nIntroduction de dons étrangers pour la maison de l\'étudiante d\'Asni et certaines écoles éloignées.\n\nPartenaires :\n- Conseil Provincial du Haouz\n- Circonscription d\'Asni\n- Association La Rencontre (France)',
        description_en:   'Association\'s contribution to well cleaning, acquisition of a new drinking water pump and repair of pumping pipes at the central school of Asni for an amount of 1,500.00 MAD.\nOpening of the association\'s headquarters for support classes for school students in Asni.\nContribution to drilling works to supply the student house of Asni with drinking water.\nContribution to the creation of the high school nucleus in Asni.\nConstruction of a multipurpose room at the Asni district, currently used as a kindergarten.\nIntroduction of foreign donations for the student house of Asni and some remote schools.\n\nPartners:\n- Provincial Council of Haouz\n- Asni District\n- Association La Rencontre (France)',
        statut:           'en_cours',
        localisation:     'Asni',
        nb_beneficiaires: 320,
        date_debut:       null,
        date_fin:         null,
        budget:           1500
      }
    ];

    await queryInterface.bulkInsert('projet',
      projets.map(p => ({
        ...p,
        created_at: now,
        updated_at: now
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projet', null, {});
  }
};
