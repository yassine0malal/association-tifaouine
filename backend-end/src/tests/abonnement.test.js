/**
 * Tests pour le service d'abonnement
 * 
 * Pour exécuter les tests :
 * npm test -- --grep "Abonnement"
 */

const request = require('supertest');
const app = require('../../server');
const { sequelize, Abonne } = require('../models');

describe('Service d\'Abonnement', () => {
  let csrfToken;
  let adminToken;

  beforeAll(async () => {
    // Synchroniser la base de données de test
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Nettoyer la table des abonnés avant chaque test
    await Abonne.destroy({ where: {} });
  });

  describe('POST /api/abonnement/csrf-token', () => {
    it('devrait générer un token CSRF et le stocker dans les cookies', async () => {
      const response = await request(app)
        .get('/api/abonnement/csrf-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Token CSRF généré');
      expect(response.body.tokenExpiry).toBeDefined();
      
      // Vérifier que le token n'est PAS dans le body (sécurité)
      expect(response.body.csrfToken).toBeUndefined();
      
      // Vérifier que le cookie est défini
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const csrfCookie = cookies.find(cookie => cookie.startsWith('csrf_token='));
      expect(csrfCookie).toBeDefined();
      expect(csrfCookie).toContain('HttpOnly');
      
      // Extraire le token du cookie pour les tests suivants
      csrfToken = csrfCookie.split('csrf_token=')[1].split(';')[0];
    });
  });

  describe('POST /api/abonnement', () => {
    beforeEach(async () => {
      // Récupérer un token CSRF pour chaque test
      const csrfResponse = await request(app)
        .get('/api/abonnement/csrf-token');
      
      // Extraire le token du cookie
      const cookies = csrfResponse.headers['set-cookie'];
      const csrfCookie = cookies.find(cookie => cookie.startsWith('csrf_token='));
      csrfToken = csrfCookie.split('csrf_token=')[1].split(';')[0];
    });

    it('devrait créer un nouvel abonnement avec succès', async () => {
      const response = await request(app)
        .post('/api/abonnement')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', [`csrf_token=${csrfToken}`])
        .send({
          email: 'test@example.com',
          website: '' // Champ honeypot vide
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('abonnement');
      expect(response.body.data.email).toBe('test@example.com');

      // Vérifier en base de données
      const abonne = await Abonne.findOne({ where: { email: 'test@example.com' } });
      expect(abonne).toBeTruthy();
    });

    it('devrait rejeter un email déjà abonné', async () => {
      // Créer un abonné existant
      await Abonne.create({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/abonnement')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', [`csrf_token=${csrfToken}`])
        .send({
          email: 'existing@example.com',
          website: ''
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('déjà abonnée');
    });

    it('devrait rejeter une requête sans token CSRF', async () => {
      const response = await request(app)
        .post('/api/abonnement')
        .send({
          email: 'test@example.com',
          website: ''
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('CSRF');
    });

    it('devrait détecter le honeypot et répondre 200 (faux succès)', async () => {
      const response = await request(app)
        .post('/api/abonnement')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', [`csrf_token=${csrfToken}`])
        .send({
          email: 'bot@example.com',
          website: 'http://spam.com' // Honeypot rempli = bot détecté
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('succès');

      // Vérifier que l'abonné n'a PAS été créé
      const abonne = await Abonne.findOne({ where: { email: 'bot@example.com' } });
      expect(abonne).toBeFalsy();
    });

    it('devrait rejeter un email invalide', async () => {
      const response = await request(app)
        .post('/api/abonnement')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', [`csrf_token=${csrfToken}`])
        .send({
          email: 'email-invalide',
          website: ''
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/abonnement/desabonner', () => {
    it('devrait désabonner un utilisateur existant', async () => {
      // Créer un abonné
      await Abonne.create({ email: 'unsubscribe@example.com' });

      const response = await request(app)
        .post('/api/abonnement/desabonner')
        .send({
          email: 'unsubscribe@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('désabonné');

      // Vérifier que l'abonné a été supprimé
      const abonne = await Abonne.findOne({ where: { email: 'unsubscribe@example.com' } });
      expect(abonne).toBeFalsy();
    });

    it('devrait rejeter le désabonnement d\'un email inexistant', async () => {
      const response = await request(app)
        .post('/api/abonnement/desabonner')
        .send({
          email: 'inexistant@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Aucun abonnement');
    });
  });

  // Note: Les tests admin nécessiteraient une authentification JWT
  // qui dépend de l'implémentation complète du système d'auth
});

module.exports = {
  // Exporter des utilitaires de test si nécessaire
};