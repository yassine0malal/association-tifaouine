/**
 * 🧪 Test Unitaire : PartenariatService
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');

// 1. Mock de Sequelize
const { sequelize } = require('../config/database');
sequelize.transaction = async (callback) => {
    return await callback({ commit: () => {}, rollback: () => {} });
};

// 2. Importation du service et de son repository
const partenariatService = require('../services/partenariat.service');
const partenariatRepository = require('../repositories/partenariat.repository');

describe('--- Test de PartenariatService ---', () => {

    describe('Fonction createPartenariat()', () => {
        
        it('devrait créer un partenaire avec succès', async () => {
            // Mock findByName pour dire qu'il n'existe pas encore
            const originalFindByName = partenariatRepository.findByName;
            partenariatRepository.findByName = async () => null;

            // Mock create
            const originalCreate = partenariatRepository.create;
            partenariatRepository.create = async (data) => ({ id: 1, ...data });

            const data = { 
                nom: 'Partenaire Test', 
                description_fr: 'Description FR', 
                description_ar: 'وصف بالعربية',
                description_en: 'Description EN'
            };
            const result = await partenariatService.createPartenariat(data);

            assert.strictEqual(result.id, 1);
            assert.strictEqual(result.nom, 'Partenaire Test');

            // Restaurer les mocks
            partenariatRepository.findByName = originalFindByName;
            partenariatRepository.create = originalCreate;
        });

        it('devrait lever une erreur si le partenaire existe déjà', async () => {
             // Mock findByName pour dire qu'il existe déjà
             const originalFindByName = partenariatRepository.findByName;
             partenariatRepository.findByName = async () => ({ id: 1, nom: 'Partenaire Existant' });

             const data = { nom: 'Partenaire Existant' };

             await assert.rejects(
                async () => await partenariatService.createPartenariat(data),
                { message: "Ce partenaire existe déjà dans la base de données" }
             );

             partenariatRepository.findByName = originalFindByName;
        });
    });

    describe('Fonction getPartenariatById()', () => {
        
        it('devrait retourner le partenaire si l\'ID existe', async () => {
            const originalFindById = partenariatRepository.findById;
            partenariatRepository.findById = async (id) => ({ id, nom: 'Partenaire 10' });

            const result = await partenariatService.getPartenariatById(10);
            assert.strictEqual(result.id, 10);
            assert.strictEqual(result.nom, 'Partenaire 10');

            partenariatRepository.findById = originalFindById;
        });

        it('devrait lever une erreur si l\'identifiant est inconnu', async () => {
            const originalFindById = partenariatRepository.findById;
            partenariatRepository.findById = async () => null;

            await assert.rejects(
                async () => await partenariatService.getPartenariatById(999),
                { message: "Ce partenaire n'existe pas" }
            );

            partenariatRepository.findById = originalFindById;
        });
    });

    describe('Fonction deletePartenariat()', () => {
        it('devrait lever une erreur si on tente de supprimer un partenaire inexistant', async () => {
            const originalFindById = partenariatRepository.findById;
            partenariatRepository.findById = async () => null;

            await assert.rejects(
                async () => await partenariatService.deletePartenariat(999),
                { message: "Suppression impossible, ce partenaire n'existe pas" }
            );

            partenariatRepository.findById = originalFindById;
        });
    });

});
