const express = require('express');
const router = express.Router();
const membreController = require('../controllers/membre.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { uploadEtreMembre } = require('../middlewares/upload.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createMembreSchema, updateMembreSchema } = require('../validations/membre.validation');

// --- TOUTES LES ROUTES CI-DESSOUS SONT RÉSERVÉES À L'ADMIN ---
router.use(verifyToken);
router.use(isAdmin);

router.get('/', paginate, membreController.getAll);

/**
 * @route   GET /api/membres/:id
 * @desc    Récupérer un membre par ID (ou query name/email)
 */
router.get('/:id', membreController.getById);

/**
 * @route   POST /api/membres
 * @desc    Créer un ou plusieurs membres
 */
router.post('/', uploadEtreMembre, validate(createMembreSchema), membreController.create);

/**
 * @route   PUT /api/membres/:id
 * @desc    Mettre à jour un membre
 */
router.put('/:id', uploadEtreMembre, validate(updateMembreSchema), membreController.update);

/**
 * @route   DELETE /api/membres/:id
 * @desc    Supprimer un membre
 */
router.delete('/:id', membreController.delete);

module.exports = router;
