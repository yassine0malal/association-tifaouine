'use strict';

// NOTE : Ce seeder doit être exécuté APRÈS :
//   - 20260408110000-add-partenariats.js
//   - 20260408140000-add-evenements.js

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Charger les événements (titre_fr -> id)
    const [evenements] = await queryInterface.sequelize.query(`SELECT id, titre_fr FROM evenement`);
    const E = {};
    evenements.forEach(e => { E[e.titre_fr] = e.id; });

    // Charger les partenariats (nom -> id)
    const [partenariats] = await queryInterface.sequelize.query(`SELECT id, nom FROM partenariat`);
    const PA = {};
    partenariats.forEach(p => { PA[p.nom] = p.id; });

    const now = new Date();

    // Helper : crée les lignes pivot pour un événement donné
    const liens = (titreFr, nomsPartenaires) => {
      const evenementId = E[titreFr];
      if (!evenementId) throw new Error(`Événement introuvable : "${titreFr}"`);
      return nomsPartenaires
        .filter(nom => {
          if (!PA[nom]) {
            console.warn(`[WARN] Partenariat ignoré (introuvable) : "${nom}"`);
            return false;
          }
          return true;
        })
        .map(nom => ({ evenement_id: evenementId, partenariat_id: PA[nom], created_at: now }));
    };

    const rows = [
      // Formations des agriculteurs — partenaires liés au projet agricole
      ...liens('Formations des agriculteurs dans les domaines agricoles', [
        'Direction Provinciale de l\'Agriculture - Programme FIDA',
        'Direction de la Recherche Agronomique de Marrakech'
      ]),

      // Campagnes de sensibilisation environnementale
      ...liens('Campagnes de sensibilisation environnementale', [
        'Direction Régionale des Eaux et Forêts - Parc National de Toubkal',
        'Société Protectrice des Animaux et de la Nature - SPNA'
      ]),

      // Caravanes médicales
      ...liens('Caravanes médicales', [
        'Helen Keller International',
        'Entraide Nationale'
      ]),

      // Programme d'éducation parentale
      ...liens('Programme d\'éducation parentale', [
        'Entraide Nationale'
      ])
    ];

    if (rows.length > 0) {
      await queryInterface.bulkInsert('evenement_partenariat', rows);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('evenement_partenariat', null, {});
  }
};
