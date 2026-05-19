/**
 * 🧪 Test Unitaire : ProjetService
 * Utilise le module 'node:test' natif de Node.js v18+
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');

// 1. Mock de Sequelize pour éviter la connexion réelle
const { sequelize } = require('../config/database');
sequelize.transaction = async (callback) => {
    return await callback({ commit: () => {}, rollback: () => {} });
};

// 2. Importation du service et de son repository
const projetService = require('../services/projet.service');
const projetRepository = require('../repositories/projet.repository');

describe('--- Test de ProjetService ---', () => {

    describe('Fonction createProjet()', () => {
        
        it('devrait créer un projet avec succès', async () => {
            // Mock : simuler le retour de création
            const originalCreate = projetRepository.create;
            projetRepository.create = async (data) => ({ id: 10, ...data });

            const data = { 
                domaine_id: 1, 
                titre_fr: 'Projet Sport', 
                titre_ar: 'مشروع رياضي', 
                titre_en: 'Sport Project',
                statut: 'planifie',
                budget: 1500.00
            };
            const result = await projetService.createProjet(data);

            assert.strictEqual(result.id, 10);
            assert.strictEqual(result.titre_fr, 'Projet Sport');

            projetRepository.create = originalCreate; // Reset mock
        });
    });

    describe('Fonction getProjetById()', () => {
        
        it('devrait lever une erreur si l\'identifiant est inconnu', async () => {
            const originalFindById = projetRepository.findById;
            projetRepository.findById = async () => null;

            await assert.rejects(
                async () => await projetService.getProjetById(999),
                { message: "Le projet avec l'ID 999 n'existe pas" }
            );

            projetRepository.findById = originalFindById;
        });
    });

    describe('Fonction deleteProjet()', () => {
        
        it('devrait échouer si le projet n\'existe pas', async () => {
            const originalFindById = projetRepository.findById;
            projetRepository.findById = async () => null;

            await assert.rejects(
                async () => await projetService.deleteProjet(50),
                { message: "Suppression impossible, ce projet n'existe pas" }
            );

            projetRepository.findById = originalFindById;
        });
    });

});
