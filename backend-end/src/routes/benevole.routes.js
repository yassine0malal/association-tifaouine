const express = require('express');
const router = express.Router();
const benevoleController = require('../controllers/benevole.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// --- ROUTES PUBLIQUES ---

/**
 * @route   GET /api/benevoles
 * @desc    Récupérer tous les bénévoles
 */
router.get('/', benevoleController.getAll);

/**
 * @route   GET /api/benevoles/:id
 * @desc    Récupérer un bénévole par ID (ou query name/email)
 */
router.get('/:id', benevoleController.getById);


// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   POST /api/benevoles
 * @desc    Créer un ou plusieurs bénévoles
 */
router.post('/', uploadMiddleware('benevoles', 'photo_profile'), benevoleController.create);

/**
 * @route   PUT /api/benevoles/:id
 * @desc    Mettre à jour un bénévole
 */
router.put('/:id', uploadMiddleware('benevoles', 'photo_profile'), benevoleController.update);

/**
 * @route   DELETE /api/benevoles/:id
 * @desc    Supprimer un bénévole
 */
router.delete('/:id', benevoleController.delete);

module.exports = router;
