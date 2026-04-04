const express = require('express');
const router = express.Router();
const membreController = require('../controllers/membre.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// --- ROUTES PUBLIQUES ---
// ... (omitted for brevity in replace_file_content but I'll update properly)

/**
 * @route   GET /api/membres
 * @desc    Récupérer tous les membres
 */
router.get('/', membreController.getAll);

/**
 * @route   GET /api/membres/:id
 * @desc    Récupérer un membre par ID (ou query name/email)
 */
router.get('/:id', membreController.getById);


// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   POST /api/membres
 * @desc    Créer un ou plusieurs membres
 */
router.post('/', uploadMiddleware('membres', 'photo_profile'), membreController.create);

/**
 * @route   PUT /api/membres/:id
 * @desc    Mettre à jour un membre
 */
router.put('/:id', uploadMiddleware('membres', 'photo_profile'), membreController.update);

/**
 * @route   DELETE /api/membres/:id
 * @desc    Supprimer un membre
 */
router.delete('/:id', membreController.delete);

module.exports = router;
