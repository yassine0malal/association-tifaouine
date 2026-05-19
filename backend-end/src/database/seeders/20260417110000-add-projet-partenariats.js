'use strict';

// NOTE : Ce seeder doit être exécuté APRÈS :
//   - 20260408110000-add-partenariats.js
//   - 20260408130000-add-projets.js

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Charger les projets (titre_fr -> id)
    const [projets] = await queryInterface.sequelize.query(`SELECT id, titre_fr FROM projet`);
    const P = {};
    projets.forEach(p => { P[p.titre_fr] = p.id; });

    // Charger les partenariats (nom_fr -> id)
    const [partenariats] = await queryInterface.sequelize.query(`SELECT id, nom_fr FROM partenariat`);
    const PA = {};
    partenariats.forEach(p => { PA[p.nom_fr] = p.id; });

    const now = new Date();

    // Helper : crée les lignes pivot pour un projet donné
    const liens = (titreFr, nomsPartenaires) => {
      const projetId = P[titreFr];
      if (!projetId) throw new Error(`Projet introuvable : "${titreFr}"`);
      return nomsPartenaires
        .filter(nom => {
          if (!PA[nom]) {
            console.warn(`[WARN] Partenariat ignoré (introuvable) : "${nom}"`);
            return false;
          }
          return true;
        })
        .map(nom => ({ projet_id: projetId, partenariat_id: PA[nom], created_at: now }));
    };

    const rows = [
      // Projet Eau Potable
      ...liens('Projet Eau Potable', [
        'Direction de l\'Équipement',
        'Province du Haouz',
        'Association Afoulki Tahnaout',
        'Direction Régionale des Eaux et Forêts - Parc National de Toubkal',
        'ALTER DOMUS Belgique'
      ]),

      // Jardin d'enfants et école coranique
      ...liens('Jardin d\'enfants et école coranique', [
        'Virgin Unite',
        'Ministère des Habous et des Affaires Islamiques',
        'Ordre des Ingénieurs de Marrakech',
        'Ahrram Toubou'
      ]),

      // Projet Hammam Public
      ...liens('Projet Hammam Public', [
        'Ministère de l\'Emploi',
        'Direction Provinciale de l\'Agriculture - Programme FIDA',
        'Ministère de l\'Agriculture'
      ]),

      // Alimentation en eau potable du musée environnemental
      ...liens('Alimentation en eau potable du musée environnemental', [
        'Direction Régionale des Eaux et Forêts - Parc National de Toubkal',
        'Société Protectrice des Animaux et de la Nature - SPNA'
      ]),

      // Formation des agriculteurs de montagne pour la culture des roses
      ...liens('Formation des agriculteurs de montagne pour la culture des roses', [
        'Direction Provinciale de l\'Agriculture - Programme FIDA',
        'Direction de la Recherche Agronomique de Marrakech',
        'Fonds National de Promotion de l\'Emploi'
      ]),

      // Projets DPA Marrakech - Programme FIDA
      ...liens('Projets DPA Marrakech - Programme FIDA', [
        'Direction Provinciale de l\'Agriculture - Programme FIDA'
      ]),

      // Soutien à l'éducation et formation - partenariat avec les écoles
      ...liens('Soutien à l\'éducation et formation - partenariat avec les écoles', [
        'Province du Haouz'
      ])
    ];

    if (rows.length > 0) {
      await queryInterface.bulkInsert('projet_partenariat', rows);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('projet_partenariat', null, {});
  }
};
