const express = require('express');
const router = express.Router();

const abonnementController = require('../controllers/abonnement.controller');
const { getCsrfToken, verifyCsrf } = require('../middlewares/csrf.middleware');
const { verifyHoneypot } = require('../middlewares/honeypot.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { abonnement, abonnesFilters } = require('../validations/abonnement.validation');

// Rate limiting spécifique pour les abonnements
const rateLimit = require('express-rate-limit');

const abonnementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 tentatives par IP
  message: {
    success: false,
    message: 'Trop de tentatives d\'abonnement. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const desabonnementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives par IP
  message: {
    success: false,
    message: 'Trop de tentatives de désabonnement. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ==================== ROUTES PUBLIQUES ====================

/**
 * @route  GET /api/abonnement/csrf-token
 * @desc   Fournit un token CSRF au formulaire frontend
 * @access Public
 */
router.get('/csrf-token', getCsrfToken);

/**
 * @route  POST /api/abonnement
 * @desc   Souscrire à la newsletter
 * @access Public — protégé par CSRF + Honeypot + rate limit
 * 
 * Pipeline de sécurité :
 *   abonnementLimiter → verifyCsrf → validate → verifyHoneypot → controller
 */
router.post(
  '/',
  abonnementLimiter,
  verifyCsrf,
  validate(abonnement),
  verifyHoneypot,
  abonnementController.souscrire.bind(abonnementController)
);

/**
 * @route  POST /api/abonnement/desabonner
 * @desc   Se désabonner de la newsletter
 * @access Public — protégé par rate limit uniquement
 */
router.post(
  '/desabonner',
  desabonnementLimiter,
  validate(abonnement.fork(['email'], { override: true })), // Seulement l'email requis
  abonnementController.desabonner.bind(abonnementController)
);

// ==================== ROUTES ADMIN ====================

/**
 * @route  GET /api/admin/abonnes
 * @desc   Récupérer tous les abonnés avec pagination et filtres
 * @access Private (Admin)
 */
router.get(
  '/admin/abonnes',
  verifyToken,
  isAdmin,
  validate(abonnesFilters, 'query'),
  abonnementController.getAllAbonnes.bind(abonnementController)
);

/**
 * @route  GET /api/admin/abonnes/stats
 * @desc   Récupérer les statistiques des abonnements
 * @access Private (Admin)
 */
router.get(
  '/admin/abonnes/stats',
  verifyToken,
  isAdmin,
  abonnementController.getStats.bind(abonnementController)
);

/**
 * @route  DELETE /api/admin/abonnes/:id
 * @desc   Supprimer un abonné
 * @access Private (Admin)
 */
router.delete(
  '/admin/abonnes/:id',
  verifyToken,
  isAdmin,
  abonnementController.supprimerAbonne.bind(abonnementController)
);

module.exports = router;