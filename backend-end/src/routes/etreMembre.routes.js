const express = require('express');
const router  = express.Router();

const etreMembreController              = require('../controllers/etreMembre.controller');
const { getCsrfToken, verifyCsrf }      = require('../middlewares/csrf.middleware');
const { verifyHoneypot }                = require('../middlewares/honeypot.middleware');
const { uploadEtreMembre }              = require('../middlewares/upload.middleware');
const { validate }                      = require('../middlewares/validate.middleware');
const { etreMembre }                    = require('../validations/etreMembre.validation');
const { etreMembre: etreMembreLimiter } = require('../middlewares/rateLimit.middleware');

/**
 * @route  GET /api/etre-membre/csrf-token
 * @desc   Fournit un token CSRF au formulaire frontend
 * @access Public
 */
router.get('/csrf-token', getCsrfToken);

/**
 * @route  POST /api/etre-membre
 * @desc   Soumettre une demande d'adhésion
 * @access Public — protégé par CSRF + Honeypot + rate limit
 *
 * Pipeline :
 *   etreMembreLimiter → verifyCsrf → uploadEtreMembre → validate → verifyHoneypot → controller
 */
router.post(
    '/',
    etreMembreLimiter,
    verifyCsrf,
    uploadEtreMembre,
    validate(etreMembre),
    verifyHoneypot,
    etreMembreController.soumettreDemande.bind(etreMembreController)
);

module.exports = router;
