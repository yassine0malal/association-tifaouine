'use strict';

// NOTE : Déposer les icônes dans backend-end/src/data/domaines/
// avec exactement les noms de fichiers définis ci-dessous avant d'appliquer le seeder.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    const domaines = [
      {
        nom_fr: 'Eau potable',
        nom_ar: 'الماء الصالح للشرب',
        nom_en: 'Drinking Water',
        icone:  '/data/domaines/eau-potable.png',
        desc_ar: 'ضمان الحصول على الماء الصالح للشرب للساكنة القروية',
        desc_fr: 'Garantir l\'accès à l\'eau potable pour les populations rurales',
        desc_en: 'Ensuring access to safe drinking water for rural communities'
      },
      {
        nom_fr: 'Assainissement',
        nom_ar: 'الصرف الصحي',
        nom_en: 'Sanitation',
        icone:  '/data/domaines/assainissement.png',
        desc_ar: 'تحسين ظروف الصرف الصحي وجودة الحياة في الوسط القروي',
        desc_fr: 'Amélioration des conditions d\'assainissement et de la qualité de vie en milieu rural',
        desc_en: 'Improving sanitation conditions and quality of life in rural areas'
      },
      {
        nom_fr: 'Éducation et formation',
        nom_ar: 'التعليم والتكوين',
        nom_en: 'Education and Training',
        icone:  '/data/domaines/education-formation.png',
        desc_ar: 'تعزيز التعليم ومحاربة الأمية وتنمية الكفاءات لدى ساكنة المنطقة',
        desc_fr: 'Renforcement de l\'éducation, lutte contre l\'analphabétisme et développement des compétences locales',
        desc_en: 'Strengthening education, fighting illiteracy and developing local skills'
      },
      {
        nom_fr: 'Développement agricole',
        nom_ar: 'التنمية الفلاحية',
        nom_en: 'Agricultural Development',
        icone:  '/data/domaines/developpement-agricole.png',
        desc_ar: 'دعم الفلاحة المحلية وتحسين الإنتاجية الزراعية في المنطقة',
        desc_fr: 'Soutien à l\'agriculture locale et amélioration de la productivité agricole dans la région',
        desc_en: 'Supporting local agriculture and improving agricultural productivity in the region'
      },
      {
        nom_fr: 'Infrastructure',
        nom_ar: 'البنية التحتية',
        nom_en: 'Infrastructure',
        icone:  '/data/domaines/infrastructure.png',
        desc_ar: 'تطوير البنية التحتية الأساسية لتحسين ظروف عيش الساكنة',
        desc_fr: 'Développement des infrastructures de base pour améliorer les conditions de vie des habitants',
        desc_en: 'Developing basic infrastructure to improve living conditions for residents'
      },
      {
        nom_fr: 'Protection de l\'environnement',
        nom_ar: 'حماية البيئة',
        nom_en: 'Environmental Protection',
        icone:  '/data/domaines/protection-environnement.png',
        desc_ar: 'الحفاظ على البيئة الطبيعية ونشر ثقافة التنمية المستدامة',
        desc_fr: 'Préservation de l\'environnement naturel et promotion d\'une culture de développement durable',
        desc_en: 'Preserving the natural environment and promoting a culture of sustainable development'
      },
      {
        nom_fr: 'Santé',
        nom_ar: 'الصحة',
        nom_en: 'Health',
        icone:  '/data/domaines/sante.png',
        desc_ar: 'تحسين الوضع الصحي وتعزيز الوقاية لدى ساكنة المنطقة',
        desc_fr: 'Amélioration de la situation sanitaire et renforcement de la prévention pour les habitants de la région',
        desc_en: 'Improving health conditions and strengthening prevention for the region\'s population'
      },
      {
        nom_fr: 'Emploi et économie sociale',
        nom_ar: 'التشغيل والاقتصاد الاجتماعي',
        nom_en: 'Employment and Social Economy',
        icone:  '/data/domaines/emploi-economie-sociale.png',
        desc_ar: 'خلق فرص الشغل ودعم المبادرات الاقتصادية المحلية المدرة للدخل',
        desc_fr: 'Création d\'emplois et soutien aux initiatives économiques locales génératrices de revenus',
        desc_en: 'Job creation and support for local income-generating economic initiatives'
      },
      {
        nom_fr: 'Club féminin et autonomisation',
        nom_ar: 'النادي النسوي والتمكين',
        nom_en: 'Women\'s Club and Empowerment',
        icone:  '/data/domaines/club-feminin-autonomisation.png',
        desc_ar: 'تمكين المرأة القروية وتعزيز مشاركتها الاجتماعية والاقتصادية',
        desc_fr: 'Autonomisation de la femme rurale et renforcement de sa participation sociale et économique',
        desc_en: 'Empowering rural women and strengthening their social and economic participation'
      },
      {
        nom_fr: 'Communication et partenariats',
        nom_ar: 'التواصل والشراكات',
        nom_en: 'Communication and Partnerships',
        icone:  '/data/domaines/communication-partenariats.png',
        desc_ar: 'بناء شراكات فعالة مع المنظمات الوطنية والدولية لدعم مشاريع الجمعية',
        desc_fr: 'Construction de partenariats efficaces avec des organisations nationales et internationales pour soutenir les projets de l\'association',
        desc_en: 'Building effective partnerships with national and international organisations to support the association\'s projects'
      }
    ];

    await queryInterface.bulkInsert('domaine',
      domaines.map(d => ({
        ...d,
        created_at: now,
        updated_at: now
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('domaine', null, {});
  }
};
 