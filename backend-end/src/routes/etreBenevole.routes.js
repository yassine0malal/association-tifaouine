const express = require('express');
const router  = express.Router();

const etreBenevoleController                = require('../controllers/etreBenevole.controller');
const { getCsrfToken, verifyCsrf }          = require('../middlewares/csrf.middleware');
const { verifyHoneypot }                    = require('../middlewares/honeypot.middleware');
const { uploadEtreBenevole }                = require('../middlewares/upload.middleware');
const { validate }                          = require('../middlewares/validate.middleware');
const { etreBenevole }                      = require('../validations/etreBenevole.validation');
const { etreBenevole: etreBenevole_Limiter } = require('../middlewares/rateLimit.middleware');

/**
 * @route  GET /api/etre-benevole/csrf-token
 * @desc   Fournit un token CSRF au formulaire frontend
 * @access Public
 */
router.get('/csrf-token', getCsrfToken);

/**
 * @route  POST /api/etre-benevole
 * @desc   Soumettre une demande de bénévolat
 * @access Public — protégé par CSRF + Honeypot + rate limit
 *
 * Pipeline :
 *   etreBenevole_Limiter → verifyCsrf → uploadEtreBenevole → validate → verifyHoneypot → controller
 */
router.post(
    '/',
    etreBenevole_Limiter,
    verifyCsrf,
    uploadEtreBenevole,
    validate(etreBenevole),
    verifyHoneypot,
    etreBenevoleController.soumettreDemande.bind(etreBenevoleController)
);

module.exports = router;
