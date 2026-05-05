'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const fs   = require('fs');
const path = require('path');
require('dotenv').config();

// ─── Configuration ─────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:5000/api';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const TEST_DIR = path.join(__dirname, '../../../benevole_test');
const PHOTO_TEST = path.join(TEST_DIR, 'profile.png');
const CARTE_TEST = path.join(TEST_DIR, 'carte.png');

const DATA_DIR = path.join(__dirname, '../data/benevoles');

// ─── Variables partagées entre les tests ───────────────────────────────────────

let adminCookie      = '';   // Cookie accessToken après login
let createdBenevoleId = null; // ID du bénévole créé pendant les tests
let photoPathCreated = null;
let cartePathCreated = null;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildFormData(fields = {}, files = {}) {
    const form = new FormData();
    for (const [key, value] of Object.entries(fields)) {
        if (value !== null && value !== undefined) {
            form.append(key, String(value));
        }
    }
    
    if (files.photo && fs.existsSync(files.photo)) {
        const buffer = fs.readFileSync(files.photo);
        const blob   = new Blob([buffer], { type: 'image/png' });
        form.append('photo', blob, path.basename(files.photo));
    }

    if (files.identity_card && fs.existsSync(files.identity_card)) {
        const buffer = fs.readFileSync(files.identity_card);
        const blob   = new Blob([buffer], { type: 'image/png' });
        form.append('identity_card', blob, path.basename(files.identity_card));
    }

    return form;
}

async function authFetch(url, options = {}) {
    const headers = { ...(options.headers || {}), Cookie: adminCookie };
    return fetch(url, { ...options, headers });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE DE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('🧑‍🤝‍🧑 Tests Intégration — API Bénévoles (Admin) 100% Champs', () => {

    before(async () => {
        console.log('\n═══════════════════════════════════════════════');
        console.log('  🔐  Initialisation des tests Bénévoles');
        console.log('═══════════════════════════════════════════════');

        // 1. Vérifier que le serveur est démarré
        try {
            await fetch(`${BASE_URL.replace('/api', '')}`);
        } catch {
            throw new Error('❌ Le serveur n\'est pas démarré sur http://localhost:5000. Lancez "npm run dev" d\'abord.');
        }

        // 3. Vérifier que les images de test existent
        assert.ok(fs.existsSync(PHOTO_TEST), `❌ Fichier de test manquant: ${PHOTO_TEST}`);
        assert.ok(fs.existsSync(CARTE_TEST), `❌ Fichier de test manquant: ${CARTE_TEST}`);

        // 4. Login admin pour obtenir le cookie JWT
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        assert.strictEqual(loginRes.status, 200, `❌ Login admin échoué (status ${loginRes.status}).`);
        
        const rawCookie = loginRes.headers.get('set-cookie') || '';
        const tokenMatch = rawCookie.match(/accessToken=([^;]+)/);
        assert.ok(tokenMatch, '❌ Cookie accessToken absent de la réponse de login');
        adminCookie = `accessToken=${tokenMatch[1]}`;

        console.log('   ✅ Login admin réussi');
    });

    describe('➕ POST /api/benevoles — CRÉATION', () => {

        it('devrait créer un bénévole avec TOUS les champs et Fichiers (201)', async () => {
            const form = buildFormData({
                nom:           'Bénévole Test Complet',
                email:         'benevole.complet@test.com',
                mession:       'Aider à organiser',
                disponibilite: 'Les weekends',
                telephone:     '+212600000000',
                competences:   'JavaScript, Node.js, React',
                adresse:       '123 Rue de la Paix, Marrakech',
                motivation:    'Je veux aider mon association !',
                status:        'actif'
            }, {
                photo: PHOTO_TEST,
                identity_card: CARTE_TEST
            });

            const res  = await authFetch(`${BASE_URL}/benevoles`, { method: 'POST', body: form });
            const body = await res.json();

            assert.strictEqual(res.status, 201, `❌ Création échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            assert.ok(body.data[0]?.id, 'Le bénévole créé doit avoir un ID');

            createdBenevoleId = body.data[0].id;
            console.log(`   ✅ Bénévole créé avec ID: ${createdBenevoleId}`);
            
            // Vérification que les champs ont bien été sauvegardés
            const b = body.data[0];
            assert.strictEqual(b.mession, 'Aider à organiser');
            
            assert.ok(b.photo_profile, '❌ photo_profile absente de la réponse');
            assert.ok(b.carte_identite, '❌ carte_identite absente de la réponse');

            photoPathCreated = path.join(__dirname, '..', b.photo_profile);
            cartePathCreated = path.join(__dirname, '..', b.carte_identite);

            assert.ok(fs.existsSync(photoPathCreated), `❌ Fichier photo non trouvé sur le disque : ${photoPathCreated}`);
            assert.ok(fs.existsSync(cartePathCreated), `❌ Fichier carte d'identité non trouvé sur le disque : ${cartePathCreated}`);
            
            console.log(`   ✅ Fichiers créés physiquement avec succès`);
        });
    });

    describe('🔍 GET /api/benevoles/:id — DÉTAIL', () => {

        it('devrait retourner le bénévole avec l\'intégralité des champs (200)', async () => {
            assert.ok(createdBenevoleId, '⚠️ Créer d\'abord le bénévole');

            const res  = await authFetch(`${BASE_URL}/benevoles/${createdBenevoleId}`);
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);

            const data = body.data;
            assert.strictEqual(data.telephone, '+212600000000', 'Le téléphone doit être +212600000000');
            assert.strictEqual(data.competences, 'JavaScript, Node.js, React');
            assert.strictEqual(data.adresse, '123 Rue de la Paix, Marrakech');
            assert.strictEqual(data.motivation, 'Je veux aider mon association !');
            assert.strictEqual(data.status, 'actif');
            
            assert.ok(data.photo_profile, '❌ photo_profile absente dans le détail');
            assert.ok(data.carte_identite, '❌ carte_identite absente dans le détail');

            console.log(`   ✅ Tous les champs et fichiers sont bien retournés par l'API GET`);
        });
    });

    describe('✏️  PUT /api/benevoles/:id — MISE À JOUR', () => {

        it('devrait mettre à jour tous les champs du bénévole (200)', async () => {
            assert.ok(createdBenevoleId, '⚠️ Créer d\'abord le bénévole');

            const form = buildFormData({
                nom:           'Bénévole Test Modifié',
                telephone:     '+212611111111',
                competences:   'Vue.js, Python',
                adresse:       '456 Avenue Nouvelle, Casa',
                motivation:    'Toujours très motivé !',
                status:        'inactif'
            });

            const res  = await authFetch(`${BASE_URL}/benevoles/${createdBenevoleId}`, { method: 'PUT', body: form });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ MAJ échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            
            const data = body.data;
            assert.strictEqual(data.telephone, '+212611111111');
            assert.strictEqual(data.competences, 'Vue.js, Python');
            assert.strictEqual(data.adresse, '456 Avenue Nouvelle, Casa');
            assert.strictEqual(data.motivation, 'Toujours très motivé !');
            assert.strictEqual(data.status, 'inactif');

            console.log('   ✅ Mise à jour de tous les champs réussie');
        });
    });

    describe('🗑️  DELETE /api/benevoles/:id — SUPPRESSION', () => {

        it('devrait supprimer le bénévole (200)', async () => {
            assert.ok(createdBenevoleId, '⚠️ Créer d\'abord le bénévole');

            const res  = await authFetch(`${BASE_URL}/benevoles/${createdBenevoleId}`, { method: 'DELETE' });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ Suppression échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            console.log('\n   ✅ Suppression réussie');

            // Vérifier qu'il est bien supprimé
            const checkRes  = await authFetch(`${BASE_URL}/benevoles/${createdBenevoleId}`);
            assert.strictEqual(checkRes.status, 404, '❌ Le bénévole existe encore en base');

            // Vérifier que les fichiers physiques sont supprimés
            assert.ok(!fs.existsSync(photoPathCreated), '❌ Le fichier photo n\'a pas été supprimé du disque !');
            assert.ok(!fs.existsSync(cartePathCreated), '❌ Le fichier carte d\'identité n\'a pas été supprimé du disque !');
            
            console.log('   ✅ Fichiers physiques supprimés avec succès');

            createdBenevoleId = null;
        });
    });

    after(async () => {
        if (createdBenevoleId) {
            console.log(`\n🧹 Nettoyage sécurité: suppression bénévole ID=${createdBenevoleId}`);
            await authFetch(`${BASE_URL}/benevoles/${createdBenevoleId}`, { method: 'DELETE' })
                .catch(err => console.warn('   Nettoyage échoué:', err.message));
        }
        console.log('\n✅ Suite de tests terminée.\n');
    });
});
