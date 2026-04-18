/**
 * 🧪 Test Unitaire : RessourceService
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// 1. Mock de Sequelize
const { sequelize } = require('../config/database');
sequelize.transaction = async (callback) => {
    return await callback({ commit: () => {}, rollback: () => {} });
};

// 2. Importation du service et de son repository
const ressourceService = require('../services/ressource.service');
const ressourceRepository = require('../repositories/ressource.repository');

describe('--- Test de RessourceService ---', () => {

    describe('Fonction createRessource()', () => {
        
        it('devrait créer une ressource avec succès', async () => {
            const originalCreate = ressourceRepository.create;
            ressourceRepository.create = async (data) => ({ id: 30, ...data });

            const data = { 
                type: 'photo', 
                url: '/data/ressources/images/test.jpg', 
                titre_fr: 'Test Photo' 
            };
            const result = await ressourceService.createRessource(data);

            assert.strictEqual(result.id, 30);
            assert.strictEqual(result.type, 'photo');

            ressourceRepository.create = originalCreate;
        });
    });

    describe('Fonction deleteRessource()', () => {
        
        it('devrait lever une erreur si la ressource n\'existe pas', async () => {
            const originalFindById = ressourceRepository.findById;
            ressourceRepository.findById = async () => null;

            await assert.rejects(
                async () => await ressourceService.deleteRessource(999),
                { message: "Ressource introuvable" }
            );

            ressourceRepository.findById = originalFindById;
        });

        it('devrait supprimer la ressource et tenter de supprimer le fichier', async () => {
            const mockRessource = { 
                id: 1, 
                url: '/data/ressources/documents/rapport.pdf' 
            };
            const originalFindById = ressourceRepository.findById;
            const originalDelete = ressourceRepository.delete;
            
            ressourceRepository.findById = async () => mockRessource;
            ressourceRepository.delete = async () => true;

            const result = await ressourceService.deleteRessource(1);
            assert.strictEqual(result, true);

            ressourceRepository.findById = originalFindById;
            ressourceRepository.delete = originalDelete;
        });
    });

});
