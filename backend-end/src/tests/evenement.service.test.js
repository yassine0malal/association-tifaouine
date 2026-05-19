/**
 * 🧪 Test Unitaire : EvenementService
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');

// 1. Mock de Sequelize
const { sequelize } = require('../config/database');
sequelize.transaction = async (callback) => {
    return await callback({ commit: () => {}, rollback: () => {} });
};

// 2. Importation du service et de son repository
const evenementService = require('../services/evenement.service');
const evenementRepository = require('../repositories/evenement.repository');

describe('--- Test de EvenementService ---', () => {

    describe('Fonction createEvenement()', () => {
        
        it('devrait créer un événement avec succès', async () => {
            const originalCreate = evenementRepository.create;
            evenementRepository.create = async (data) => ({ id: 20, ...data });

            const data = { 
                domaine_id: 1, 
                titre_fr: 'Conférence Eau', 
                titre_ar: 'مؤتمر الماء', 
                titre_en: 'Water Conference',
                date_debut: new Date()
            };
            const result = await evenementService.createEvenement(data);

            assert.strictEqual(result.id, 20);
            assert.strictEqual(result.titre_fr, 'Conférence Eau');

            evenementRepository.create = originalCreate;
        });
    });

    describe('Fonction getEvenementById()', () => {
        
        it('devrait lever une erreur si l\'identifiant est inconnu', async () => {
            const originalFindById = evenementRepository.findById;
            evenementRepository.findById = async () => null;

            await assert.rejects(
                async () => await evenementService.getEvenementById(999),
                { message: "L'événement avec l'ID 999 n'existe pas" }
            );

            evenementRepository.findById = originalFindById;
        });
    });

});
