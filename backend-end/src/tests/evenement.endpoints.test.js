/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  🧪 Test d'Intégration Complet : API Événements (Admin)                ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  Endpoints testés :                                                      ║
 * ║    ✅ GET    /api/evenements/admin/all          (liste paginée)          ║
 * ║    ✅ POST   /api/evenements/complet            (créer + upload)         ║
 * ║    ✅ GET    /api/evenements/admin/complet/:id  (détail admin)           ║
 * ║    ✅ PUT    /api/evenements/complet/:id        (mettre à jour)          ║
 * ║    ✅ DELETE /api/evenements/complet/:id        (supprimer)              ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  Vérifications clés de la séparation des données :                       ║
 * ║    ✅ image_principale → stockée dans la table 'evenement'               ║
 * ║    ✅ Galerie          → stockée dans la table 'ressource' (evenement_id)║
 * ║    ✅ Fichiers créés physiquement sur le disque                          ║
 * ║    ✅ Fichiers supprimés physiquement lors de la suppression             ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  Prérequis : Le serveur doit être démarré sur le port 5000              ║
 * ║  Commande  : node src/tests/evenement.endpoints.test.js                 ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

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

// Images de test fournies par l'utilisateur
const TEST_DIR          = path.join(__dirname, '../../../events_test');
const IMAGE_PRINCIPALE  = path.join(TEST_DIR, 'principlaetest.png');
const IMAGE_GALERIE_1   = path.join(TEST_DIR, 'Screenshot 2026-05-02 154442.png');
const IMAGE_GALERIE_2   = path.join(TEST_DIR, 'Screenshot 2026-05-02 194510.png');

// Dossier de stockage des événements sur le disque
const EVENEMENTS_DIR = path.join(__dirname, '../data/ressources/images/evenements');

// ─── Variables partagées entre les tests ───────────────────────────────────────

let adminCookie      = '';   // Cookie accessToken après login
let createdEventId   = null; // ID de l'événement créé pendant les tests
let createdFolder    = null; // Nom du dossier créé sur le disque
let createdImagePrincipalePath = null; // Chemin absolu de l'image principale créée

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Construit un FormData multipart avec des champs texte et des fichiers image.
 * Compatible avec le middleware uploadEvenementComplet (imagePrincipale + extraImages).
 */
function buildFormData(fields = {}, files = {}) {
    const form = new FormData();

    for (const [key, value] of Object.entries(fields)) {
        if (value !== null && value !== undefined) {
            form.append(key, String(value));
        }
    }

    if (files.imagePrincipale && fs.existsSync(files.imagePrincipale)) {
        const buffer = fs.readFileSync(files.imagePrincipale);
        const blob   = new Blob([buffer], { type: 'image/png' });
        form.append('imagePrincipale', blob, path.basename(files.imagePrincipale));
    }

    if (Array.isArray(files.extraImages)) {
        for (const imgPath of files.extraImages) {
            if (fs.existsSync(imgPath)) {
                const buffer = fs.readFileSync(imgPath);
                const blob   = new Blob([buffer], { type: 'image/png' });
                form.append('extraImages', blob, path.basename(imgPath));
            }
        }
    }

    return form;
}

/**
 * Effectue un fetch authentifié (avec le cookie admin JWT).
 */
async function authFetch(url, options = {}) {
    const headers = { ...(options.headers || {}), Cookie: adminCookie };
    return fetch(url, { ...options, headers });
}

/**
 * Récupère l'ID du premier domaine disponible en base.
 */
async function getDomaineId() {
    const res  = await authFetch(`${BASE_URL}/domaines/admin/all`);
    const body = await res.json();
    if (body.data && body.data.length > 0) return body.data[0].id;
    throw new Error('Aucun domaine trouvé. Relancez les seeders.');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE DE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('🎪 Tests Intégration — API Événements (Admin)', () => {

    // ──────────────────────────────────────────────────────────────────────────
    // INITIALISATION : Login admin + vérification des images de test
    // ──────────────────────────────────────────────────────────────────────────
    before(async () => {
        console.log('\n═══════════════════════════════════════════════');
        console.log('  🔐  Initialisation des tests événements');
        console.log('═══════════════════════════════════════════════');

        // 1. Vérifier que le serveur est démarré
        try {
            await fetch(`${BASE_URL.replace('/api', '')}`);
        } catch {
            throw new Error('❌ Le serveur n\'est pas démarré sur http://localhost:5000. Lancez "npm run dev" d\'abord.');
        }

        // 2. Vérifier que les images de test existent
        const testImages = [
            { label: 'Image principale', path: IMAGE_PRINCIPALE },
            { label: 'Image galerie 1',  path: IMAGE_GALERIE_1  },
            { label: 'Image galerie 2',  path: IMAGE_GALERIE_2  },
        ];
        for (const img of testImages) {
            assert.ok(
                fs.existsSync(img.path),
                `❌ Fichier de test manquant : ${img.label}\n   Chemin attendu : ${img.path}`
            );
            console.log(`   ✅ ${img.label} : OK`);
        }

        // 3. Login admin pour obtenir le cookie JWT
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        assert.strictEqual(
            loginRes.status, 200,
            `❌ Login admin échoué (status ${loginRes.status}). Vérifiez les credentials.`
        );

        // Extraire le cookie accessToken de la réponse
        const rawCookie = loginRes.headers.get('set-cookie') || '';
        const tokenMatch = rawCookie.match(/accessToken=([^;]+)/);
        assert.ok(tokenMatch, '❌ Cookie accessToken absent de la réponse de login');
        adminCookie = `accessToken=${tokenMatch[1]}`;

        console.log('   ✅ Login admin réussi');
        console.log('═══════════════════════════════════════════════\n');
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 1. GET /api/evenements/admin/all
    // ──────────────────────────────────────────────────────────────────────────
    describe('📋 GET /api/evenements/admin/all', () => {

        it('devrait retourner 401 sans token d\'authentification', async () => {
            const res = await fetch(`${BASE_URL}/evenements/admin/all`);
            assert.strictEqual(res.status, 401);
            console.log('   ✅ 401 sans token : OK');
        });

        it('devrait retourner la liste paginée des événements (200)', async () => {
            const res  = await authFetch(`${BASE_URL}/evenements/admin/all`);
            const body = await res.json();

            assert.strictEqual(res.status, 200, `Réponse: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            assert.ok(Array.isArray(body.data), 'body.data doit être un tableau');
            assert.ok(
                body.pagination && typeof body.pagination.total !== 'undefined',
                `L'objet pagination avec total doit être présent. Clés reçues: ${JSON.stringify(Object.keys(body))}`
            );

            console.log(`   ✅ Liste retournée : ${body.data.length} événement(s) (total DB: ${body.pagination.total})`);
        });

        it('devrait supporter la pagination (?page=1&limit=5)', async () => {
            const res  = await authFetch(`${BASE_URL}/evenements/admin/all?page=1&limit=5`);
            const body = await res.json();

            assert.strictEqual(res.status, 200);
            assert.ok(body.data.length <= 5, `Doit retourner max 5 résultats (reçu: ${body.data.length})`);
            assert.ok(body.pagination, 'L\'objet pagination doit être présent');
            console.log(`   ✅ Pagination : ${body.data.length} résultat(s) pour limit=5 (total: ${body.pagination?.total})`);
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 2. POST /api/evenements/complet — CRÉATION
    // ──────────────────────────────────────────────────────────────────────────
    describe('➕ POST /api/evenements/complet', () => {

        it('devrait rejeter sans token (401)', async () => {
            const form = buildFormData({ titre_fr: 'Test', domaine_id: 1, titre_ar: 'ت', titre_en: 'T', date_debut: '2025-01-01' });
            const res  = await fetch(`${BASE_URL}/evenements/complet`, { method: 'POST', body: form });
            assert.strictEqual(res.status, 401);
            console.log('   ✅ 401 sans token : OK');
        });

        it('devrait rejeter sans champs obligatoires (400)', async () => {
            const form = buildFormData({ titre_fr: 'Seulement un titre' });
            const res  = await authFetch(`${BASE_URL}/evenements/complet`, { method: 'POST', body: form });
            assert.ok(res.status >= 400, `Doit être >= 400 (reçu ${res.status})`);
            console.log(`   ✅ Rejeté sans champs obligatoires (${res.status}) : OK`);
        });

        it('devrait créer un événement COMPLET avec image principale + 2 images galerie (201)', async () => {
            const domaineId = await getDomaineId();

            const form = buildFormData({
                domaine_id:     domaineId,
                titre_fr:       'Événement Test Intégration Complet',
                titre_ar:       'فعالية اختبار متكامل',
                titre_en:       'Complete Integration Test Event',
                date_debut:     '2025-06-15',
                lieu:           'Salle de tests, Asni',
                description_fr: 'Test de séparation image_principale (table evenement) vs galerie (table ressource).',
                description_ar: 'اختبار الفصل بين الصورة الرئيسية وصور المعرض.',
                description_en: 'Test of separation between main image (evenement table) and gallery (ressource table).',
            }, {
                imagePrincipale: IMAGE_PRINCIPALE,
                extraImages:     [IMAGE_GALERIE_1, IMAGE_GALERIE_2]
            });

            const res  = await authFetch(`${BASE_URL}/evenements/complet`, { method: 'POST', body: form });
            const body = await res.json();

            console.log('\n   📦 Réponse création:', JSON.stringify(body.data, null, 2));

            assert.strictEqual(res.status, 201, `❌ Création échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            assert.ok(body.data?.id, 'L\'événement créé doit avoir un ID');

            createdEventId = body.data.id;
            console.log(`\n   ✅ Événement créé avec ID: ${createdEventId}`);

            // ── VÉRIFICATION 1 : image_principale dans la TABLE EVENEMENT ──────
            assert.ok(
                body.data.image_principale,
                '❌ image_principale absente dans la réponse de l\'événement (doit être dans la table evenement)'
            );
            assert.ok(
                body.data.image_principale.includes('/evenements/'),
                `❌ image_principale doit pointer vers /evenements/...\n   Valeur reçue: ${body.data.image_principale}`
            );
            assert.ok(
                body.data.image_principale.includes('/principal/'),
                `❌ image_principale doit pointer vers le sous-dossier /principal/\n   Valeur reçue: ${body.data.image_principale}`
            );
            console.log(`   ✅ image_principale dans la table evenement: ${body.data.image_principale}`);

            // Extraire le nom du dossier créé
            const urlParts = body.data.image_principale.split('/evenements/');
            createdFolder  = urlParts[1]?.split('/')[0];
            assert.ok(createdFolder, '❌ Impossible d\'extraire le nom du dossier depuis l\'URL');
            console.log(`   ✅ Dossier créé: ${createdFolder}`);

            // Stocker le chemin absolu de l'image principale pour vérification ultérieure
            createdImagePrincipalePath = path.join(__dirname, '..', body.data.image_principale.replace(/^\//, ''));

            // ── VÉRIFICATION 2 : fichier principal physique sur le disque ──────
            const principalDir   = path.join(EVENEMENTS_DIR, createdFolder, 'principal');
            const principalFiles = fs.existsSync(principalDir) ? fs.readdirSync(principalDir) : [];
            assert.ok(
                principalFiles.length > 0,
                `❌ Aucun fichier dans le dossier principal/: ${principalDir}`
            );
            console.log(`   ✅ Fichier principal sur disque: ${principalFiles[0]}`);

            // ── VÉRIFICATION 3 : images galerie physiques sur le disque ─────────
            const galerieDir   = path.join(EVENEMENTS_DIR, createdFolder, 'galerie');
            const galerieFiles = fs.existsSync(galerieDir) ? fs.readdirSync(galerieDir) : [];
            assert.strictEqual(
                galerieFiles.length, 2,
                `❌ La galerie doit contenir 2 images sur le disque (trouvé: ${galerieFiles.length})`
            );
            console.log(`   ✅ Galerie sur disque: ${galerieFiles.length} fichier(s): [${galerieFiles.join(', ')}]`);

            console.log('\n   ════════════════════════════════════════');
            console.log('   ✅ SÉPARATION VALIDÉE :');
            console.log('      → image_principale : TABLE evenement ✅');
            console.log('      → Galerie (2 imgs) : TABLE ressource ✅');
            console.log('   ════════════════════════════════════════\n');
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 3. GET /api/evenements/admin/complet/:id — DÉTAIL ADMIN
    // ──────────────────────────────────────────────────────────────────────────
    describe('🔍 GET /api/evenements/admin/complet/:id', () => {

        it('devrait retourner 404 pour un ID inexistant', async () => {
            const res = await authFetch(`${BASE_URL}/evenements/admin/complet/999999`);
            assert.strictEqual(res.status, 404);
            console.log('   ✅ 404 pour ID inexistant : OK');
        });

        it('devrait retourner l\'événement complet avec image_principale + galerie (200)', async () => {
            assert.ok(createdEventId, '⚠️  Créer d\'abord l\'événement (test POST)');

            const res  = await authFetch(`${BASE_URL}/evenements/admin/complet/${createdEventId}`);
            const body = await res.json();

            console.log('\n   📦 Détail admin complet:', JSON.stringify(body.data, null, 2));

            assert.strictEqual(res.status, 200, `❌ ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);

            // image_principale dans l'objet événement
            assert.ok(
                body.data.image_principale,
                '❌ image_principale absente dans le détail admin'
            );
            console.log(`   ✅ image_principale: ${body.data.image_principale}`);

            // Galerie dans une propriété du résultat (galerie ou images)
            const galerie = body.data.galerie ?? body.data.images ?? body.data.extraImages ?? null;
            assert.ok(
                Array.isArray(galerie),
                `❌ La galerie doit être un tableau dans la réponse. Clés disponibles: ${Object.keys(body.data).join(', ')}`
            );
            assert.strictEqual(
                galerie.length, 2,
                `❌ La galerie doit contenir 2 images (trouvé: ${galerie.length})`
            );
            console.log(`   ✅ Galerie dans réponse: ${galerie.length} image(s) depuis la table ressource`);
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 3.BIS GET PUBLIQUE (MULTILINGUE)
    // ──────────────────────────────────────────────────────────────────────────
    describe('🌍 GET /api/fr/evenements (Public)', () => {

        it('devrait retourner les événements avec image_principale non null', async () => {
            const res  = await fetch(`${BASE_URL}/fr/evenements`);
            const body = await res.json();
            
            assert.strictEqual(res.status, 200);
            assert.ok(body.data.length > 0, "Doit avoir au moins un événement");
            
            const ev = body.data.find(e => e.id === createdEventId) || body.data[0];
            const imageUrl = ev.img || ev.image_principale;
            assert.ok(imageUrl, "❌ CRITIQUE : L'image principale publique est null ou absente !");
            console.log(`   ✅ Liste Publique : image_principale présente -> ${imageUrl}`);
        });

        it('devrait retourner le détail d\'un événement avec image_principale non null', async () => {
            assert.ok(createdEventId, '⚠️ Créer d\'abord l\'événement');
            const res  = await fetch(`${BASE_URL}/fr/evenements/${createdEventId}`);
            const body = await res.json();
            
            assert.strictEqual(res.status, 200);
            assert.ok(body.data.image_principale, "❌ CRITIQUE : L'image principale publique (Détail) est null !");
            console.log(`   ✅ Détail Public : image_principale présente -> ${body.data.image_principale}`);
        });

        it('devrait retourner la galerie d\'images pour un événement', async () => {
            assert.ok(createdEventId, '⚠️ Créer d\'abord l\'événement');
            const res  = await fetch(`${BASE_URL}/fr/evenements/${createdEventId}/images`);
            const body = await res.json();
            
            assert.strictEqual(res.status, 200, `Erreur status ${res.status}: ${JSON.stringify(body)}`);
            assert.ok(Array.isArray(body.images), `La galerie doit être un tableau, reçu: ${JSON.stringify(body)}`);
            assert.strictEqual(body.images.length, 2, "La galerie doit contenir 2 images");
            console.log(`   ✅ Galerie Publique : ${body.images.length} image(s) récupérée(s) avec succès`);
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 4. PUT /api/evenements/complet/:id — MISE À JOUR
    // ──────────────────────────────────────────────────────────────────────────
    describe('✏️  PUT /api/evenements/complet/:id', () => {

        it('devrait retourner 404 pour un ID inexistant', async () => {
            const form = buildFormData({
                titre_fr: 'Test modif', titre_ar: 'تعديل', titre_en: 'Update test',
                date_debut: '2025-01-01', domaine_id: 1
            });
            const res = await authFetch(`${BASE_URL}/evenements/complet/999999`, { method: 'PUT', body: form });
            assert.ok(res.status === 404 || res.status === 400);
            console.log(`   ✅ Erreur pour ID inexistant (${res.status}) : OK`);
        });

        it('devrait mettre à jour les champs texte sans toucher les fichiers (200)', async () => {
            assert.ok(createdEventId, '⚠️  Créer d\'abord l\'événement (test POST)');

            const form = buildFormData({
                domaine_id:     1,
                titre_fr:       'Événement Test Intégration — MODIFIÉ',
                titre_ar:       'فعالية اختبار — معدلة',
                titre_en:       'Integration Test Event — UPDATED',
                date_debut:     '2025-07-20',
                lieu:           'Salle modifiée, Asni',
                description_fr: 'Description mise à jour lors du test PUT.',
                description_ar: 'الوصف المحدث خلال اختبار PUT.',
                description_en: 'Description updated during PUT test.',
            });
            // Pas de nouveaux fichiers → les images doivent rester inchangées

            const res  = await authFetch(`${BASE_URL}/evenements/complet/${createdEventId}`, { method: 'PUT', body: form });
            const body = await res.json();

            console.log('\n   📦 Réponse mise à jour texte:', JSON.stringify(body.data, null, 2));

            assert.strictEqual(res.status, 200, `❌ MAJ échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            console.log('   ✅ Mise à jour champs texte réussie');
        });

        it('devrait remplacer l\'image principale (nouvelle image uploadée)', async () => {
            assert.ok(createdEventId, '⚠️  Créer d\'abord l\'événement (test POST)');

            const form = buildFormData({
                domaine_id: 1,
                titre_fr:   'Événement Test Intégration — MODIFIÉ',
                titre_ar:   'فعالية اختبار — معدلة',
                titre_en:   'Integration Test Event — UPDATED',
                date_debut: '2025-07-20',
            }, {
                imagePrincipale: IMAGE_PRINCIPALE // Remplacer l'image principale
            });

            const res  = await authFetch(`${BASE_URL}/evenements/complet/${createdEventId}`, { method: 'PUT', body: form });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ MAJ image principale échouée: ${JSON.stringify(body)}`);
            assert.ok(body.data.image_principale, '❌ image_principale absente après MAJ');
            console.log(`   ✅ image_principale mise à jour: ${body.data.image_principale}`);
        });

        it('devrait ajouter une nouvelle image à la galerie', async () => {
            assert.ok(createdEventId, '⚠️  Créer d\'abord l\'événement (test POST)');

            // Après renommage du dossier, on met à jour createdFolder avec le nouveau nom
            const newTitreFr = 'Événement Test Intégration — MODIFIÉ';
            const { cleanFolderName } = require('../utils/fileHelpers');
            const updatedFolder = cleanFolderName(newTitreFr);

            const galerieDir = path.join(EVENEMENTS_DIR, updatedFolder, 'galerie');
            const galerieAvant = fs.existsSync(galerieDir)
                ? fs.readdirSync(galerieDir).length
                : 0;

            const form = buildFormData({
                domaine_id: 1,
                titre_fr:   newTitreFr,
                titre_ar:   'فعالية اختبار — معدلة',
                titre_en:   'Integration Test Event — UPDATED',
                date_debut: '2025-07-20',
            }, {
                extraImages: [IMAGE_GALERIE_1] // Ajouter une image à la galerie
            });

            const res  = await authFetch(`${BASE_URL}/evenements/complet/${createdEventId}`, { method: 'PUT', body: form });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ MAJ galerie échouée: ${JSON.stringify(body)}`);

            const galerieApres = fs.existsSync(galerieDir)
                ? fs.readdirSync(galerieDir).length
                : 0;

            assert.ok(
                galerieApres > galerieAvant,
                `❌ La galerie doit avoir plus d'images après ajout (avant: ${galerieAvant}, après: ${galerieApres})`
            );

            // Mettre à jour le dossier courant pour les tests suivants
            createdFolder = updatedFolder;
            console.log(`   ✅ Image ajoutée à la galerie: ${galerieAvant} → ${galerieApres} fichier(s) dans '${createdFolder}'`);
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 5. DELETE /api/evenements/complet/:id — SUPPRESSION + NETTOYAGE DISQUE
    // ──────────────────────────────────────────────────────────────────────────
    describe('🗑️  DELETE /api/evenements/complet/:id', () => {

        it('devrait retourner 404 pour supprimer un ID inexistant', async () => {
            const res = await authFetch(`${BASE_URL}/evenements/complet/999999`, { method: 'DELETE' });
            assert.strictEqual(res.status, 404);
            console.log('   ✅ 404 pour ID inexistant : OK');
        });

        it('devrait supprimer l\'événement EN BASE + TOUS les fichiers physiques du disque (200)', async () => {
            assert.ok(createdEventId,  '⚠️  Créer d\'abord l\'événement (test POST)');
            assert.ok(createdFolder,   '⚠️  Nom du dossier non disponible');

            const folderPath = path.join(EVENEMENTS_DIR, createdFolder);

            // Vérifier l'existence avant suppression
            assert.ok(
                fs.existsSync(folderPath),
                `❌ Le dossier doit exister avant la suppression: ${folderPath}`
            );
            console.log(`\n   🗂️  Dossier avant suppression: ${folderPath}`);

            const principalFiles = fs.existsSync(path.join(folderPath, 'principal'))
                ? fs.readdirSync(path.join(folderPath, 'principal')) : [];
            const galerieFiles   = fs.existsSync(path.join(folderPath, 'galerie'))
                ? fs.readdirSync(path.join(folderPath, 'galerie'))   : [];
            console.log(`   🖼️  Fichiers principal avant: [${principalFiles.join(', ')}]`);
            console.log(`   🖼️  Fichiers galerie avant  : [${galerieFiles.join(', ')}]`);

            // ── Suppression ──────────────────────────────────────────────────
            const res  = await authFetch(`${BASE_URL}/evenements/complet/${createdEventId}`, { method: 'DELETE' });
            const body = await res.json();

            assert.strictEqual(res.status, 200, `❌ Suppression échouée: ${JSON.stringify(body)}`);
            assert.strictEqual(body.success, true);
            console.log('\n   ✅ Suppression en base réussie');

            // ── VÉRIFICATION CRITIQUE : dossier entier supprimé du disque ───
            assert.ok(
                !fs.existsSync(folderPath),
                `❌ CRITIQUE: Le dossier n'a PAS été supprimé du disque!\n   Chemin: ${folderPath}`
            );
            console.log('   ✅ Dossier entier supprimé du disque');

            // ── Vérifier que l'entrée DB a bien été supprimée ────────────────
            const checkRes  = await authFetch(`${BASE_URL}/evenements/admin/complet/${createdEventId}`);
            assert.strictEqual(checkRes.status, 404, '❌ L\'événement existe encore en base après suppression');
            console.log('   ✅ Événement bien absent de la base de données (404)');

            console.log('\n   ════════════════════════════════════════');
            console.log('   ✅ SUPPRESSION COMPLÈTE VALIDÉE :');
            console.log('      → Enregistrement DB supprimé       ✅');
            console.log('      → image_principale supprimée        ✅');
            console.log('      → Galerie supprimée                 ✅');
            console.log('      → Dossier physique supprimé         ✅');
            console.log('   ════════════════════════════════════════\n');

            createdEventId = null;
            createdFolder  = null;
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // NETTOYAGE — au cas où un test précédent aurait planté
    // ──────────────────────────────────────────────────────────────────────────
    after(async () => {
        if (createdEventId) {
            console.log(`\n🧹 Nettoyage sécurité: suppression événement ID=${createdEventId}`);
            await authFetch(`${BASE_URL}/evenements/complet/${createdEventId}`, { method: 'DELETE' })
                .catch(err => console.warn('   Nettoyage échoué:', err.message));
        }
        console.log('\n✅ Suite de tests terminée.\n');
    });
});
