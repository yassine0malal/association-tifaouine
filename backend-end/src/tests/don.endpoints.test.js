'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

// ─── Configuration ─────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:5000/api';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ─── Variables partagées entre les tests ───────────────────────────────────────

let adminCookie     = '';
let financierDonId  = null;
let materielDonId   = null;

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function authFetch(url, options = {}) {
    const headers = { 
        'Content-Type': 'application/json',
        ...(options.headers || {}), 
        Cookie: adminCookie 
    };
    return fetch(url, { ...options, headers });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE DE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('💰 Tests Intégration — API Dons (Admin & Public)', () => {

    before(async () => {
        console.log('\n═══════════════════════════════════════════════');
        console.log('  🏦  Initialisation des tests Dons');
        console.log('═══════════════════════════════════════════════');

        try {
            await fetch(`${BASE_URL.replace('/api', '')}`);
        } catch {
            throw new Error('❌ Le serveur n\'est pas démarré sur http://localhost:5000.');
        }

        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        assert.strictEqual(loginRes.status, 200, '❌ Login admin échoué.');
        
        const rawCookie = loginRes.headers.get('set-cookie') || '';
        const tokenMatch = rawCookie.match(/accessToken=([^;]+)/);
        assert.ok(tokenMatch, '❌ Cookie accessToken absent');
        adminCookie = `accessToken=${tokenMatch[1]}`;

        console.log('   ✅ Login admin réussi');
    });

    describe('➕ POST /api/dons/financier — CRÉATION (Public)', () => {

        it('devrait permettre à un visiteur de soumettre un don financier (201)', async () => {
            const res  = await fetch(`${BASE_URL}/dons/financier`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    email:            'donateur@test.com',
                    nom_complet:      'Jean Donateur',
                    telephone:        '+212600000001',
                    type_destination: 'general',
                    montant:          500,
                    devise:           'MAD',
                    ref_transaction:  'TRANS-12345'
                })
            });

            const body = await res.json();
            if (res.status !== 201) console.error('❌ Erreur création financier:', body);
            assert.strictEqual(res.status, 201);
            assert.strictEqual(body.success, true);
            assert.ok(body.data.id);
            
            financierDonId = body.data.id;
            console.log(`   ✅ Don financier créé ID: ${financierDonId}`);
        });
    });

    describe('➕ POST /api/dons/materiel — CRÉATION (Admin)', () => {

        it('devrait permettre à un admin d\'enregistrer un don matériel (201)', async () => {
            const res  = await authFetch(`${BASE_URL}/dons/materiel`, {
                method:  'POST',
                body:    JSON.stringify({
                    email:            'donateur.objet@test.com',
                    nom_complet:      'Marie Objet',
                    type_destination: 'general',
                    description:      '10 Cartables scolaires',
                    quantite:         10
                })
            });

            const body = await res.json();
            if (res.status !== 201) console.error('❌ Erreur création matériel:', body);
            assert.strictEqual(res.status, 201);
            assert.strictEqual(body.success, true);
            
            materielDonId = body.data.id;
            console.log(`   ✅ Don matériel créé ID: ${materielDonId}`);
        });
    });

    describe('🔍 GET /api/dons — LISTE & RECHERCHE (Admin)', () => {

        it('devrait retourner la liste paginée des dons (200)', async () => {
            const res  = await authFetch(`${BASE_URL}/dons?limit=5`);
            const body = await res.json();

            assert.strictEqual(res.status, 200);
            assert.ok(Array.isArray(body.data));
            assert.ok(body.data.length >= 2);
            assert.ok(body.pagination.total >= 2);
            console.log('   ✅ Liste paginée récupérée');
        });

        it('devrait permettre de rechercher un donateur par son nom (200)', async () => {
            const res  = await authFetch(`${BASE_URL}/dons?search=Marie`);
            const body = await res.json();

            assert.strictEqual(res.status, 200);
            const found = body.data.some(d => d.nom_complet.includes('Marie'));
            assert.ok(found, 'Marie Objet devrait être trouvée');
            console.log('   ✅ Recherche fonctionnelle');
        });
    });

    describe('✏️  PATCH /api/dons/:id/statut — VALIDATION (Admin)', () => {

        it('devrait permettre de passer un don en statut "traite" (200)', async () => {
            assert.ok(financierDonId);
            const res  = await authFetch(`${BASE_URL}/dons/${financierDonId}/statut`, {
                method: 'PATCH',
                body:   JSON.stringify({ statut: 'traite' })
            });

            const body = await res.json();
            assert.strictEqual(res.status, 200);
            assert.strictEqual(body.data.statut, 'traite');
            console.log('   ✅ Statut mis à jour avec succès');
        });
    });

    describe('🗑️  DELETE /api/dons/:id — SUPPRESSION (Admin)', () => {

        it('devrait supprimer les dons de test (200)', async () => {
            const res1 = await authFetch(`${BASE_URL}/dons/${financierDonId}`, { method: 'DELETE' });
            const res2 = await authFetch(`${BASE_URL}/dons/${materielDonId}`,  { method: 'DELETE' });

            assert.strictEqual(res1.status, 200);
            assert.strictEqual(res2.status, 200);
            console.log('   ✅ Dons de test supprimés');
        });
    });

    after(async () => {
        console.log('\n✅ Suite de tests Dons terminée.\n');
    });
});
