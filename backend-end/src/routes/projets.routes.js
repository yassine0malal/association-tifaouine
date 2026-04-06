const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createProjetSchema, updateProjetSchema } = require('../validations/projet.validation');

/**
 * @route   GET /api/projets
 * @desc    Récupérer tous les projets (Public)
 */
router.get('/', projetController.getAll.bind(projetController));

/**
 * @route   GET /api/projets/:id
 * @desc    Récupérer un projet par ID (Public)
 */
router.get('/:id', projetController.getById.bind(projetController));

// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   POST /api/projets
 * @desc    Créer un nouveau projet
 */
router.post('/', validate(createProjetSchema), projetController.create.bind(projetController));

/**
 * @route   PUT /api/projets/:id
 * @desc    Mettre à jour un projet
 */
router.put('/:id', validate(updateProjetSchema), projetController.update.bind(projetController));

/**
 * @route   DELETE /api/projets/:id
 * @desc    Supprimer un projet
 */
router.delete('/:id', projetController.delete.bind(projetController));

module.exports = router;
