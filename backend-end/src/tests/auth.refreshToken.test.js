/**
 * 🧪 Test Unitaire : AuthService - refreshAdminToken()
 * Utilise le module 'node:test' natif de Node.js v18+
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');

// --- Setup des variables d'environnement avant tout import ---
process.env.JWT_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_ACCESS_EXPIRATION = '15m';
process.env.JWT_REFRESH_EXPIRATION = '7';

// --- Mock du modèle RefreshToken ---
const { RefreshToken } = require('../models');

const authService = require('../services/auth.service');
const utilisateurRepository = require('../repositories/utilisateur.repository');

// Helper : générer un refresh token JWT valide
function makeRefreshToken(userId, secret = process.env.JWT_REFRESH_SECRET, expiresIn = '7d') {
    return jwt.sign({ id: userId }, secret, { expiresIn });
}

describe('--- Test de AuthService : refreshAdminToken() ---', () => {

    describe('Cas d\'erreur', () => {

        it('devrait lever une erreur si le token est absent (null)', async () => {
            await assert.rejects(
                async () => await authService.refreshAdminToken(null),
                { message: 'Refresh token manquant.' }
            );
        });

        it('devrait lever une erreur si le token est absent (undefined)', async () => {
            await assert.rejects(
                async () => await authService.refreshAdminToken(undefined),
                { message: 'Refresh token manquant.' }
            );
        });

        it('devrait lever une erreur si le token n\'existe pas en base', async () => {
            const originalFindOne = RefreshToken.findOne;
            RefreshToken.findOne = async () => null;

            await assert.rejects(
                async () => await authService.refreshAdminToken('token_inexistant'),
                { message: 'Refresh token invalide.' }
            );

            RefreshToken.findOne = originalFindOne;
        });

        it('devrait lever une erreur si le token est expiré en base', async () => {
            const originalFindOne = RefreshToken.findOne;
            const originalDestroy = RefreshToken.destroy;

            const pastDate = new Date(Date.now() - 1000); // déjà expiré
            RefreshToken.findOne = async () => ({ token: 'expired_token', expiry_date: pastDate });
            RefreshToken.destroy = async () => 1;

            await assert.rejects(
                async () => await authService.refreshAdminToken('expired_token'),
                { message: 'Refresh token expiré.' }
            );

            RefreshToken.findOne = originalFindOne;
            RefreshToken.destroy = originalDestroy;
        });

        it('devrait lever une erreur si la signature JWT est invalide', async () => {
            const originalFindOne = RefreshToken.findOne;

            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const badToken = makeRefreshToken(1, 'mauvais_secret');

            RefreshToken.findOne = async () => ({ token: badToken, expiry_date: futureDate });

            await assert.rejects(
                async () => await authService.refreshAdminToken(badToken),
                { message: 'Refresh token invalide.' }
            );

            RefreshToken.findOne = originalFindOne;
        });

        it('devrait lever une erreur si l\'utilisateur n\'existe plus en base', async () => {
            const originalFindOne = RefreshToken.findOne;
            const originalFindById = utilisateurRepository.findAdminById;

            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const validToken = makeRefreshToken(999);

            RefreshToken.findOne = async () => ({ token: validToken, expiry_date: futureDate });
            utilisateurRepository.findAdminById = async () => null;

            await assert.rejects(
                async () => await authService.refreshAdminToken(validToken),
                { message: 'Refresh token invalide.' }
            );

            RefreshToken.findOne = originalFindOne;
            utilisateurRepository.findAdminById = originalFindById;
        });
    });

    describe('Cas de succès', () => {

        it('devrait retourner un nouvel accessToken valide', async () => {
            const originalFindOne = RefreshToken.findOne;
            const originalFindById = utilisateurRepository.findAdminById;

            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const validToken = makeRefreshToken(1);

            const mockUser = { id: 1, email: 'admin@test.com', type: 'admin' };

            RefreshToken.findOne = async () => ({ token: validToken, expiry_date: futureDate });
            utilisateurRepository.findAdminById = async () => mockUser;

            const result = await authService.refreshAdminToken(validToken);

            assert.ok(result.accessToken, 'accessToken doit être présent');

            // Vérifier que le token généré est bien décodable
            const decoded = jwt.verify(result.accessToken, process.env.JWT_SECRET);
            assert.strictEqual(decoded.id, mockUser.id);
            assert.strictEqual(decoded.email, mockUser.email);
            assert.strictEqual(decoded.type, mockUser.type);

            RefreshToken.findOne = originalFindOne;
            utilisateurRepository.findAdminById = originalFindById;
        });

        it('devrait générer un accessToken différent à chaque appel', async () => {
            const originalFindOne = RefreshToken.findOne;
            const originalFindById = utilisateurRepository.findAdminById;

            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const validToken = makeRefreshToken(1);
            const mockUser = { id: 1, email: 'admin@test.com', type: 'admin' };

            RefreshToken.findOne = async () => ({ token: validToken, expiry_date: futureDate });
            utilisateurRepository.findAdminById = async () => mockUser;

            // Petit délai pour que les timestamps JWT diffèrent
            const result1 = await authService.refreshAdminToken(validToken);
            await new Promise(r => setTimeout(r, 1100));
            const result2 = await authService.refreshAdminToken(validToken);

            assert.notStrictEqual(result1.accessToken, result2.accessToken);

            RefreshToken.findOne = originalFindOne;
            utilisateurRepository.findAdminById = originalFindById;
        });
    });
});
