const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenement.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createEvenementSchema, updateEvenementSchema } = require('../validations/evenement.validation');

/**
 * @route   GET /api/evenements
 * @desc    Récupérer tous les événements (Public)
 */
router.get('/', evenementController.getAll.bind(evenementController));

/**
 * @route   GET /api/evenements/:id
 * @desc    Récupérer un événement par ID (Public)
 */
router.get('/:id', evenementController.getById.bind(evenementController));

// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   POST /api/evenements
 * @desc    Créer un événement
 */
router.post('/', validate(createEvenementSchema), evenementController.create.bind(evenementController));

/**
 * @route   PUT /api/evenements/:id
 * @desc    Mettre à jour un événement
 */
router.put('/:id', validate(updateEvenementSchema), evenementController.update.bind(evenementController));

/**
 * @route   DELETE /api/evenements/:id
 * @desc    Supprimer un événement
 */
router.delete('/:id', evenementController.delete.bind(evenementController));

module.exports = router;
