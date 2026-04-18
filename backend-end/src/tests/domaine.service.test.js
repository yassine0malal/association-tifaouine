/**
 * 🧪 Test Unitaire : DomaineService
 * Utilise le module 'node:test' natif de Node.js v18+
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

// 1. Mock de Sequelize avant de charger le service pour éviter la connexion réelle
const { sequelize } = require('../config/database');
sequelize.transaction = async (callback) => {
    // Simule une transaction Sequelize simplifiée
    return await callback({ commit: () => {}, rollback: () => {} });
};

// 2. Importation du service et de son repository
const domaineService = require('../services/domaine.service');
const domaineRepository = require('../repositories/domaine.repository');

describe('--- Test de DomaineService ---', () => {

    describe('Fonction createDomaine()', () => {
        
        it('devrait échouer si des champs obligatoires sont manquants', async () => {
            const incompleteData = { nom_fr: 'Test' }; // manque ar et en
            await assert.rejects(
                async () => await domaineService.createDomaine(incompleteData),
                { message: "les noms du domaine en fr, ar et en sont obligatoires" }
            );
        });

        it('devrait échouer si le domaine existe déjà (doublon)', async () => {
            // Mock : simuler que le domaine existe
            const originalFindByName = domaineRepository.findByName;
            domaineRepository.findByName = async () => ({ id: 1, nom_fr: 'Eau' });

            const data = { nom_fr: 'Eau', nom_ar: 'ماء', nom_en: 'Water' };
            await assert.rejects(
                async () => await domaineService.createDomaine(data),
                { message: "ce domaine existe deja dans la base de donnees" }
            );

            domaineRepository.findByName = originalFindByName; // Reset mock
        });

        it('devrait créer un domaine avec succès', async () => {
            // Mock : simuler que le domaine n'existe pas et retour de création
            const originalFindByName = domaineRepository.findByName;
            const originalCreate = domaineRepository.create;
            
            domaineRepository.findByName = async () => null;
            domaineRepository.create = async (data) => ({ id: 5, ...data });

            const data = { nom_fr: 'Sante', nom_ar: 'صحة', nom_en: 'Health' };
            const result = await domaineService.createDomaine(data);

            assert.strictEqual(result.id, 5);
            assert.strictEqual(result.nom_fr, 'Sante');

            domaineRepository.findByName = originalFindByName;
            domaineRepository.create = originalCreate;
        });
    });

    describe('Fonction getDomaineById()', () => {
        
        it('devrait lever une erreur si l\'identifiant est inconnu', async () => {
            const originalFindById = domaineRepository.findById;
            domaineRepository.findById = async () => null;

            await assert.rejects(
                async () => await domaineService.getDomaineById(999),
                { message: "ce domaine n'existe pas" }
            );

            domaineRepository.findById = originalFindById;
        });

        it('devrait retourner le domaine si l\'ID est valide', async () => {
            const mockDomaine = { id: 1, nom_fr: 'Education' };
            const originalFindById = domaineRepository.findById;
            domaineRepository.findById = async () => mockDomaine;

            const result = await domaineService.getDomaineById(1);
            assert.strictEqual(result.id, 1);
            assert.strictEqual(result.nom_fr, 'Education');

            domaineRepository.findById = originalFindById;
        });
    });

    describe('Fonction updateDomaine()', () => {
        
        it('devrait lever une erreur si le domaine à mettre à jour n\'existe pas', async () => {
            const originalFindById = domaineRepository.findById;
            domaineRepository.findById = async () => null;

            await assert.rejects(
                async () => await domaineService.updateDomaine(99, { nom_fr: 'Update' }),
                { message: "domaine introuvable pour la mise a jour" }
            );

            domaineRepository.findById = originalFindById;
        });
    });

    describe('Fonction deleteDomaine()', () => {
        
        it('devrait lever une erreur si le domaine à supprimer n\'existe pas', async () => {
            const originalFindById = domaineRepository.findById;
            domaineRepository.findById = async () => null;

            await assert.rejects(
                async () => await domaineService.deleteDomaine(99),
                { message: "suppression impossible, ce domaine n'existe pas" }
            );

            domaineRepository.findById = originalFindById;
        });

        it('devrait supprimer un domaine sans icône avec succès', async () => {
            const originalFindById = domaineRepository.findById;
            const originalDelete = domaineRepository.delete;

            domaineRepository.findById = async () => ({ id: 1, icone: null });
            domaineRepository.delete = async () => true;

            const result = await domaineService.deleteDomaine(1);
            assert.strictEqual(result, true);

            domaineRepository.findById = originalFindById;
            domaineRepository.delete = originalDelete;
        });
    });

});
