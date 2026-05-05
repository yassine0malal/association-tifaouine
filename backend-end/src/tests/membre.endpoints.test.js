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

const TEST_DIR = path.join(__dirname, '../../../membre_test');
const PHOTO_TEST = path.join(TEST_DIR, 'profile_test.png');
const CARTE_TEST = path.join(TEST_DIR, 'carte_test.png');
const CV_TEST = path.join(TEST_DIR, 'cv.pdf');

const DATA_DIR = path.join(__dirname, '../data/membres');

// ─── Variables partagées entre les tests ───────────────────────────────────────

let adminCookie      = '';
let createdMembreId  = null;
let photoPathCreated = null;
let cartePathCreated = null;
let cvPathCreated    = null;

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

    if (files.cv_doc && fs.existsSync(files.cv_doc)) {
        const buffer = fs.readFileSync(files.cv_doc);
        const blob   = new Blob([buffer], { type: 'application/pdf' }); // Type correct pour le PDF
        form.append('cv_doc', blob, path.basename(files.cv_doc));
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

describe('🧑‍💼 Tests Intégration — API Membres (Admin) 100% Champs', () => {

    before(async () => {
        console.log('\n═══════════════════════════════════════════════');
        console.log('  🔐  Initialisation des tests Membres');
        console.log('═══════════════════════════════════════════════');

        try {
            await fetch(`${BASE_URL.replace('/api', '')}`);
        } catch {
            throw new Error('❌ Le serveur n\'est pas démarré sur http://localhost:5000. Lancez "npm run dev" d\'abord.');
        }

        assert.ok(fs.existsSync(PHOTO_TEST), `❌ Fichier de test manquant: ${PHOTO_TEST}`);
        assert.ok(fs.existsSync(CARTE_TEST), `❌ Fichier de test manquant: ${CARTE_TEST}`);

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

    describe('➕ POST /api/membres — CRÉATION', () => {

        it('devrait créer un membre avec TOUS les champs et Fichiers (201)', async () => {
            const form = buildFormData({
                nom:           'Membre Test Complet',
                email:         'membre.complet@test.com',
                poste:         'Président',
                description_poste_fr: 'Description FR',
                description_poste_ar: 'Description AR',
                description_poste_en: 'Description EN',
                telephone:     '+212600000001',
                competences:   'Management, Finance',
                adresse:       'Agadir',
                motivation:    'Motivé pour gérer',
                status:        'actif'
            }, {
                photo: PHOTO_TEST,
                identity_card: CARTE_TEST,
                cv_doc: CV_TEST
            });

            const res  = await authFetch(`${BASE_URL}/membres`, { method: 'POST', body: form });
            const body = await res.json();

            assert.strictEqual(res.status, 201, `❌ Création échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            assert.ok(body.data[0]?.id, 'Le membre créé doit avoir un ID');

            createdMembreId = body.data[0].id;
            console.log(`   ✅ Membre créé avec ID: ${createdMembreId}`);
            
            const m = body.data[0];
            assert.strictEqual(m.poste, 'Président');
            
            assert.ok(m.photo_profile, '❌ photo_profile absente de la réponse');
            assert.ok(m.carte_identite, '❌ carte_identite absente de la réponse');
            assert.ok(m.cv, '❌ cv absent de la réponse');

            photoPathCreated = path.join(__dirname, '..', m.photo_profile);
            cartePathCreated = path.join(__dirname, '..', m.carte_identite);
            cvPathCreated    = path.join(__dirname, '..', m.cv);

            assert.ok(fs.existsSync(photoPathCreated), `❌ Fichier photo non trouvé sur le disque : ${photoPathCreated}`);
            assert.ok(fs.existsSync(cartePathCreated), `❌ Fichier carte d'identité non trouvé sur le disque : ${cartePathCreated}`);
            assert.ok(fs.existsSync(cvPathCreated), `❌ Fichier CV non trouvé sur le disque : ${cvPathCreated}`);
            
            console.log(`   ✅ Fichiers créés physiquement avec succès`);
        });
    });

    describe('🔍 GET /api/membres/:id — DÉTAIL', () => {

        it('devrait retourner le membre avec l\'intégralité des champs (200)', async () => {
            assert.ok(createdMembreId, '⚠️ Créer d\'abord le membre');

            const res  = await authFetch(`${BASE_URL}/membres/${createdMembreId}`);
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);

            const data = body.data;
            assert.strictEqual(data.telephone, '+212600000001');
            assert.strictEqual(data.competences, 'Management, Finance');
            assert.strictEqual(data.adresse, 'Agadir');
            assert.strictEqual(data.motivation, 'Motivé pour gérer');
            assert.strictEqual(data.status, 'actif');
            assert.strictEqual(data.description_poste_fr, 'Description FR');
            
            assert.ok(data.photo_profile, '❌ photo_profile absente dans le détail');
            assert.ok(data.carte_identite, '❌ carte_identite absente dans le détail');
            assert.ok(data.cv, '❌ cv absent dans le détail');

            console.log(`   ✅ Tous les champs et fichiers sont bien retournés par l'API GET`);
        });
    });

    describe('✏️  PUT /api/membres/:id — MISE À JOUR', () => {

        it('devrait mettre à jour tous les champs du membre (200)', async () => {
            assert.ok(createdMembreId, '⚠️ Créer d\'abord le membre');

            const form = buildFormData({
                nom:           'Membre Test Modifié',
                telephone:     '+212611111112',
                competences:   'RH',
                adresse:       'Tanger',
                motivation:    'Toujours motivé',
                status:        'inactif'
            });

            const res  = await authFetch(`${BASE_URL}/membres/${createdMembreId}`, { method: 'PUT', body: form });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ MAJ échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            
            const data = body.data;
            assert.strictEqual(data.telephone, '+212611111112');
            assert.strictEqual(data.competences, 'RH');
            assert.strictEqual(data.adresse, 'Tanger');
            assert.strictEqual(data.motivation, 'Toujours motivé');
            assert.strictEqual(data.status, 'inactif');

            console.log('   ✅ Mise à jour de tous les champs réussie');
        });
    });

    describe('🗑️  DELETE /api/membres/:id — SUPPRESSION', () => {

        it('devrait supprimer le membre et ses fichiers (200)', async () => {
            assert.ok(createdMembreId, '⚠️ Créer d\'abord le membre');

            const res  = await authFetch(`${BASE_URL}/membres/${createdMembreId}`, { method: 'DELETE' });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ Suppression échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            console.log('\n   ✅ Suppression réussie');

            const checkRes  = await authFetch(`${BASE_URL}/membres/${createdMembreId}`);
            assert.strictEqual(checkRes.status, 404, '❌ Le membre existe encore en base');

            // Vérifier que les fichiers physiques sont supprimés
            assert.ok(!fs.existsSync(photoPathCreated), '❌ Le fichier photo n\'a pas été supprimé du disque !');
            assert.ok(!fs.existsSync(cartePathCreated), '❌ Le fichier carte d\'identité n\'a pas été supprimé du disque !');
            assert.ok(!fs.existsSync(cvPathCreated), '❌ Le fichier cv n\'a pas été supprimé du disque !');
            
            console.log('   ✅ Fichiers physiques supprimés avec succès');

            createdMembreId = null;
        });
    });

    after(async () => {
        if (createdMembreId) {
            console.log(`\n🧹 Nettoyage sécurité: suppression membre ID=${createdMembreId}`);
            await authFetch(`${BASE_URL}/membres/${createdMembreId}`, { method: 'DELETE' })
                .catch(err => console.warn('   Nettoyage échoué:', err.message));
        }
        console.log('\n✅ Suite de tests terminée.\n');
    });
});
