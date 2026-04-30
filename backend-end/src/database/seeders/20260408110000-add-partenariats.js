'use strict';
const fs = require('fs');
const path = require('path');

// NOTE : Déposer les logos dans backend-end/src/data/partenariats/
// avec exactement les noms de fichiers définis ci-dessous avant d'appliquer le seeder.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    const partenariats = [

      // ─── Partenaires Institutionnels ───────────────────────────────────────
      {
        nom:            'Ministère de l\'Emploi',
        logo:           '/data/partenariats/ministere-emploi.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Ministère de l\'Emploi',
        description_ar: 'وزارة التشغيل - مؤسسة حكومية',
        description_en: 'Government institutional partner - Ministry of Employment',
        site_web:       null
      },
      {
        nom:            'Ministère de l\'Agriculture',
        logo:           '/data/partenariats/ministere-agriculture.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Ministère de l\'Agriculture',
        description_ar: 'وزارة الفلاحة - مؤسسة حكومية',
        description_en: 'Government institutional partner - Ministry of Agriculture',
        site_web:       'https://www.agriculture.gov.ma'
      },
      {
        nom:            'Ministère du Développement Social, de la Famille et de la Solidarité',
        logo:           '/data/partenariats/ministere-developpement-social.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Développement social et solidarité',
        description_ar: 'وزارة التنمية الاجتماعية والأسرة والتضامن - مؤسسة حكومية',
        description_en: 'Government institutional partner - Social Development, Family and Solidarity',
        site_web:       null
      },
      {
        nom:            'Ministère des Habous et des Affaires Islamiques',
        logo:           '/data/partenariats/ministere-habous.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Affaires religieuses et islamiques',
        description_ar: 'وزارة الأوقاف والشؤون الإسلامية - مؤسسة حكومية',
        description_en: 'Government institutional partner - Ministry of Islamic Affairs',
        site_web:       'https://www.habous.gov.ma'
      },
      {
        nom:            'Direction Provinciale de l\'Agriculture - Programme FIDA',
        logo:           '/data/partenariats/dpa-fida.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Programme FIDA, développement rural',
        description_ar: 'المديرية الإقليمية للفلاحة - برنامج FIDA - مؤسسة حكومية',
        description_en: 'Government institutional partner - Provincial Agriculture Directorate, FIDA Programme',
        site_web:       null
      },
      {
        nom:            'Province du Haouz',
        logo:           '/data/partenariats/province-haouz.png',
        description_fr: 'Administration territoriale - Province du Haouz',
        description_ar: 'عمالة الحوز - مؤسسة إدارية',
        description_en: 'Territorial administration - Province of Haouz',
        site_web:       null
      },
      {
        nom:            'Direction de l\'Équipement',
        logo:           '/data/partenariats/direction-equipement.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Direction de l\'Équipement',
        description_ar: 'مديرية التجهيز - مؤسسة حكومية',
        description_en: 'Government institutional partner - Directorate of Equipment',
        site_web:       null
      },
      {
        nom:            'Direction Régionale des Eaux et Forêts - Parc National de Toubkal',
        logo:           '/data/partenariats/eaux-forets-toubkal.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Gestion du Parc National de Toubkal',
        description_ar: 'المديرية الجهوية للمياه والغابات - إدارة المنتزه الوطني لتوبقال',
        description_en: 'Government institutional partner - Regional Water and Forests, Toubkal National Park',
        site_web:       null
      },
      {
        nom:            'Entraide Nationale',
        logo:           '/data/partenariats/entraide-nationale.png',
        description_fr: 'Institution nationale de solidarité sociale - Entraide Nationale',
        description_ar: 'التعاون الوطني - مؤسسة وطنية',
        description_en: 'National social solidarity institution - Entraide Nationale',
        site_web:       'https://www.entraide.ma'
      },
      {
        nom:            'Commune d\'Asni',
        logo:           '/data/partenariats/commune-asni.png',
        description_fr: 'Commune rurale partenaire - Commune d\'Asni',
        description_ar: 'جماعة آسني - جماعة قروية',
        description_en: 'Rural commune partner - Commune of Asni',
        site_web:       null
      },
      {
        nom:            'Fonds National de Promotion de l\'Emploi',
        logo:           '/data/partenariats/fnpe.png',
        description_fr: 'Institution nationale - Promotion et financement de l\'emploi',
        description_ar: 'الصندوق الوطني لإنعاش التشغيل - مؤسسة وطنية',
        description_en: 'National institution - Employment promotion and funding',
        site_web:       null
      },
      {
        nom:            'Direction de la Recherche Agronomique de Marrakech',
        logo:           '/data/partenariats/recherche-agronomique-marrakech.png',
        description_fr: 'Partenaire institutionnel gouvernemental - Recherche agronomique',
        description_ar: 'مديرية البحث الزراعي بمراكش - مؤسسة حكومية',
        description_en: 'Government institutional partner - Agronomic Research Directorate Marrakech',
        site_web:       null
      },
      {
        nom:            'Centre Régional d\'Alphabétisation d\'Agadir',
        logo:           '/data/partenariats/centre-alphabetisation-agadir.png',
        description_fr: 'Institution éducative - Lutte contre l\'analphabétisme, région Agadir',
        description_ar: 'المركز الجهوي لمحو الأمية باكادير - مؤسسة تعليمية',
        description_en: 'Educational institution - Regional Literacy Centre of Agadir',
        site_web:       null
      },
      {
        nom:            'Helen Keller International',
        logo:           '/data/partenariats/helen-keller-international.png',
        description_fr: 'Organisation internationale - Santé et nutrition, Helen Keller International',
        description_ar: 'منظمة هيلين كيلير - منظمة دولية',
        description_en: 'International organisation - Health and nutrition, Helen Keller International',
        site_web:       'https://www.hki.org'
      },
      {
        nom:            'Ordre des Ingénieurs de Marrakech',
        logo:           '/data/partenariats/ordre-ingenieurs-marrakech.png',
        description_fr: 'Ordre professionnel - Ingénieurs de la région Marrakech',
        description_ar: 'هيئة المهندسين بمراكش - هيئة مهنية',
        description_en: 'Professional order - Engineers of the Marrakech region',
        site_web:       null
      },
      {
        nom:            'Centre de Développement des Énergies Renouvelables',
        logo:           '/data/partenariats/cder.png',
        description_fr: 'Institution nationale - Développement des énergies renouvelables (CDER)',
        description_ar: 'مركز تنمية الطاقات المتجددة - مؤسسة وطنية',
        description_en: 'National institution - Renewable Energy Development Centre',
        site_web:       'https://www.iresen.org'
      },
      // ─── Société Civile Marocaine ───────────────────────────────────────────
      {
        nom:            'Association Al Majal',
        logo:           '/data/partenariats/association-al-majal.png',
        description_fr: 'Association nationale de la société civile marocaine',
        description_ar: 'جمعية المجال - جمعية وطنية',
        description_en: 'Moroccan civil society national association - Al Majal',
        site_web:       null
      },
      {
        nom:            'Association Sidi Belyout',
        logo:           '/data/partenariats/association-sidi-belyout.png',
        description_fr: 'Association nationale de la société civile marocaine',
        description_ar: 'جمعية سيدي بليوط - جمعية وطنية',
        description_en: 'Moroccan civil society national association - Sidi Belyout',
        site_web:       null
      },
      {
        nom:            'Association Inirol',
        logo:           '/data/partenariats/association-inirol.png',
        description_fr: 'Association nationale de la société civile marocaine',
        description_ar: 'جمعية انيرويل - جمعية وطنية',
        description_en: 'Moroccan civil society national association - Inirol',
        site_web:       null
      },
      {
        nom:            'Association Afoulki Tahnaout',
        logo:           '/data/partenariats/association-afoulki-tahnaout.png',
        description_fr: 'Association nationale de la société civile - région Tahnaout',
        description_ar: 'جمعية أفولكي بتحناوت - جمعية وطنية',
        description_en: 'Moroccan civil society national association - Afoulki Tahnaout',
        site_web:       null
      },
      {
        nom:            'Société Protectrice des Animaux et de la Nature - SPNA',
        logo:           '/data/partenariats/spna.png',
        description_fr: 'Association nationale - Protection des animaux et de la nature (SPNA)',
        description_ar: 'جمعية الرفق بالحيوان والمحافظة على الطبيعة - SPNA',
        description_en: 'National association - Animal and nature protection, SPNA',
        site_web:       null
      },
      {
        nom:            'Ahrram Toubou',
        logo:           '/data/partenariats/ahrram-toubou.png',
        description_fr: 'Association locale partenaire - Ahrram Toubou',
        description_ar: 'أهرام طوبو - جمعية',
        description_en: 'Local partner association - Ahrram Toubou',
        site_web:       null
      },
      // ─── Partenaires Internationaux ────────────────────────────────────────
      {
        nom:            'Virgin Unite',
        logo:           '/data/partenariats/virgin-unite.png',
        description_fr: 'Organisation internationale - Royaume-Uni, fondation caritative Virgin Unite',
        description_ar: 'جمعية فرجين اونايت - منظمة دولية - المملكة المتحدة',
        description_en: 'International organisation - United Kingdom, Virgin Unite charitable foundation',
        site_web:       'https://www.virginunite.com'
      },
      {
        nom:            'Rotary Club',
        logo:           '/data/partenariats/rotary-club.png',
        description_fr: 'Organisation internationale - Rotary Club, réseau mondial de service',
        description_ar: 'جمعية روطاري كلوب - منظمة دولية',
        description_en: 'International organisation - Rotary Club, global service network',
        site_web:       'https://www.rotary.org'
      },
      {
        nom:            'Association La Rencontre',
        logo:           '/data/partenariats/association-la-rencontre.png',
        description_fr: 'Association étrangère française - La Rencontre, coopération franco-marocaine',
        description_ar: 'جمعية La Rencontre الفرنسية - جمعية أجنبية - فرنسا',
        description_en: 'French foreign association - La Rencontre, Franco-Moroccan cooperation',
        site_web:       null
      },
      {
        nom:            'Norsys',
        logo:           '/data/partenariats/norsys.png',
        description_fr: 'Entreprise française partenaire - Norsys, numérique responsable',
        description_ar: 'منظمة Norsys - شركة / منظمة - فرنسا',
        description_en: 'French partner company - Norsys, responsible digital services',
        site_web:       'https://www.norsys.fr'
      },
      {
        nom:            'Agre-Sud / Age-Sud',
        logo:           '/data/partenariats/agre-sud.png',
        description_fr: 'Organisation internationale partenaire - Agre-Sud / Age-Sud',
        description_ar: 'منظمة Age-Sud - منظمة دولية',
        description_en: 'International partner organisation - Agre-Sud / Age-Sud',
        site_web:       null
      },
      {
        nom:            'ALTER DOMUS Belgique',
        logo:           '/data/partenariats/alter-domus.png',
        description_fr: 'Société privée belge partenaire - ALTER DOMUS',
        description_ar: 'شركة التير دوموس البلجيكية - شركة خاصة - بلجيكا',
        description_en: 'Belgian private company partner - ALTER DOMUS',
        site_web:       'https://www.alterdomus.com'
      },
      {
        nom:            'TRANSMITING - Agence de voyages',
        logo:           '/data/partenariats/transmiting.png',
        description_fr: 'Société privée belge partenaire - TRANSMITING, agence de voyages',
        description_ar: 'وكالة الأسفار ترانسميتينغ - شركة خاصة - بلجيكا',
        description_en: 'Belgian private company partner - TRANSMITING travel agency',
        site_web:       null
      },
      {
        nom:            'Virgin Hotel - Kasbah Tamadot',
        logo:           '/data/partenariats/virgin-hotel-tamadot.png',
        description_fr: 'Société privée internationale - Virgin Hotel, Kasbah Tamadot',
        description_ar: 'شركة فيرجين أوتيل - قصبة تماضوت - شركة خاصة',
        description_en: 'International private company - Virgin Hotel, Kasbah Tamadot',
        site_web:       'https://www.virginlimitededition.com/en/kasbah-tamadot'
      }
    ];

    const partenariatsWithCheck = partenariats.map(p => {
      // Extraire le nom du fichier depuis le chemin attendu
      const fileName = path.basename(p.logo);
      // Construire le chemin absolu vers le dossier où les images sont stockées
      const filePath = path.join(__dirname, '../../data/partenariats', fileName);
      
      // Vérifier si le fichier existe
      const finalLogoPath = fs.existsSync(filePath) ? p.logo : '/data/partenariats/default.png';

      return {
        ...p,
        logo: finalLogoPath,
        created_at: now,
        updated_at: now
      };
    });

    await queryInterface.bulkInsert('partenariat', partenariatsWithCheck);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('partenariat', null, {});
  }
};

