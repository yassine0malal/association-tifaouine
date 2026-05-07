'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const translations = [
      {
        nom_fr: "Ministère de l'Emploi",
        nom_ar: 'وزارة التشغيل',
        nom_en: 'Ministry of Employment'
      },
      {
        nom_fr: "Ministère de l'Agriculture",
        nom_ar: 'وزارة الفلاحة',
        nom_en: 'Ministry of Agriculture'
      },
      {
        nom_fr: 'Ministère du Développement Social, de la Famille et de la Solidarité',
        nom_ar: 'وزارة التنمية الاجتماعية والأسرة والتضامن',
        nom_en: 'Ministry of Social Development, Family and Solidarity'
      },
      {
        nom_fr: 'Ministère des Habous et des Affaires Islamiques',
        nom_ar: 'وزارة الأوقاف والشؤون الإسلامية',
        nom_en: 'Ministry of Islamic Affairs'
      },
      {
        nom_fr: "Direction Provinciale de l'Agriculture - Programme FIDA",
        nom_ar: 'المديرية الإقليمية للفلاحة - برنامج FIDA',
        nom_en: 'Provincial Agriculture Directorate - FIDA Programme'
      },
      {
        nom_fr: 'Province du Haouz',
        nom_ar: 'عمالة الحوز',
        nom_en: 'Province of Haouz'
      },
      {
        nom_fr: "Direction de l'Équipement",
        nom_ar: 'مديرية التجهيز',
        nom_en: 'Directorate of Equipment'
      },
      {
        nom_fr: 'Direction Régionale des Eaux et Forêts - Parc National de Toubkal',
        nom_ar: 'المديرية الجهوية للمياه والغابات - المنتزه الوطني لتوبقال',
        nom_en: 'Regional Water and Forests - Toubkal National Park'
      },
      {
        nom_fr: 'Entraide Nationale',
        nom_ar: 'التعاون الوطني',
        nom_en: 'Entraide Nationale'
      },
      {
        nom_fr: "Commune d'Asni",
        nom_ar: 'جماعة آسني',
        nom_en: 'Commune of Asni'
      },
      {
        nom_fr: "Fonds National de Promotion de l'Emploi",
        nom_ar: 'الصندوق الوطني لإنعاش التشغيل',
        nom_en: 'National Employment Promotion Fund'
      },
      {
        nom_fr: 'Direction de la Recherche Agronomique de Marrakech',
        nom_ar: 'مديرية البحث الزراعي بمراكش',
        nom_en: 'Agronomic Research Directorate of Marrakech'
      },
      {
        nom_fr: "Centre Régional d'Alphabétisation d'Agadir",
        nom_ar: 'المركز الجهوي لمحو الأمية بأكادير',
        nom_en: 'Regional Literacy Centre of Agadir'
      },
      {
        nom_fr: 'Helen Keller International',
        nom_ar: 'منظمة هيلين كيلير الدولية',
        nom_en: 'Helen Keller International'
      },
      {
        nom_fr: 'Ordre des Ingénieurs de Marrakech',
        nom_ar: 'هيئة المهندسين بمراكش',
        nom_en: 'Order of Engineers of Marrakech'
      },
      {
        nom_fr: 'Centre de Développement des Énergies Renouvelables',
        nom_ar: 'مركز تنمية الطاقات المتجددة',
        nom_en: 'Renewable Energy Development Centre'
      },
      {
        nom_fr: 'Association Al Majal',
        nom_ar: 'جمعية المجال',
        nom_en: 'Association Al Majal'
      },
      {
        nom_fr: 'Association Sidi Belyout',
        nom_ar: 'جمعية سيدي بليوط',
        nom_en: 'Association Sidi Belyout'
      },
      {
        nom_fr: 'Association Inirol',
        nom_ar: 'جمعية انيرويل',
        nom_en: 'Association Inirol'
      },
      {
        nom_fr: 'Association Afoulki Tahnaout',
        nom_ar: 'جمعية أفولكي بتحناوت',
        nom_en: 'Association Afoulki Tahnaout'
      },
      {
        nom_fr: 'Société Protectrice des Animaux et de la Nature - SPNA',
        nom_ar: 'جمعية الرفق بالحيوان والمحافظة على الطبيعة - SPNA',
        nom_en: 'Animal and Nature Protection Society - SPNA'
      },
      {
        nom_fr: 'Ahrram Toubou',
        nom_ar: 'أهرام طوبو',
        nom_en: 'Ahrram Toubou'
      },
      {
        nom_fr: 'Virgin Unite',
        nom_ar: 'جمعية فيرجين يونايت',
        nom_en: 'Virgin Unite'
      },
      {
        nom_fr: 'Rotary Club',
        nom_ar: 'روتاري كلوب',
        nom_en: 'Rotary Club'
      },
      {
        nom_fr: 'Association La Rencontre',
        nom_ar: 'جمعية اللقاء',
        nom_en: 'Association La Rencontre'
      },
      {
        nom_fr: 'Norsys',
        nom_ar: 'نورسيس',
        nom_en: 'Norsys'
      },
      {
        nom_fr: 'Agre-Sud / Age-Sud',
        nom_ar: 'منظمة أجي-سود',
        nom_en: 'Agre-Sud / Age-Sud'
      },
      {
        nom_fr: 'ALTER DOMUS Belgique',
        nom_ar: 'ألتر دوموس بلجيكا',
        nom_en: 'ALTER DOMUS Belgium'
      },
      {
        nom_fr: 'TRANSMITING - Agence de voyages',
        nom_ar: 'وكالة الأسفار ترانسميتينغ',
        nom_en: 'TRANSMITING - Travel Agency'
      },
      {
        nom_fr: 'Virgin Hotel - Kasbah Tamadot',
        nom_ar: 'فيرجين هوتيل - قصبة تماضوت',
        nom_en: 'Virgin Hotel - Kasbah Tamadot'
      }
    ];

    for (const t of translations) {
      await queryInterface.bulkUpdate(
        'partenariat',
        { nom_ar: t.nom_ar, nom_en: t.nom_en },
        { nom_fr: t.nom_fr }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'partenariat',
      { nom_ar: '', nom_en: '' },
      {}
    );
  }
};
