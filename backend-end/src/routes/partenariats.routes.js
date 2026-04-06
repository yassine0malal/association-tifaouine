const express = require('express');
const router = express.Router();
const partenariatController = require('../controllers/partenariat.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createPartenariatSchema, updatePartenariatSchema } = require('../validations/partenariat.validation');

/**
 * @route   GET /api/partenariats
 * @desc    Récupérer tous les partenariats (Public)
 */
router.get('/', partenariatController.getAll.bind(partenariatController));

/**
 * @route   GET /api/partenariats/:id
 * @desc    Récupérer un partenariat par son ID (Public)
 */
router.get('/:id', partenariatController.getById.bind(partenariatController));

// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   POST /api/partenariats
 * @desc    Créer un nouveau partenariat
 */
router.post(
    '/', 
    uploadMiddleware('partenariats', 'logo'), 
    validate(createPartenariatSchema), 
    partenariatController.create.bind(partenariatController)
);

/**
 * @route   PUT /api/partenariats/:id
 * @desc    Mettre à jour un partenariat
 */
router.put(
    '/:id', 
    uploadMiddleware('partenariats', 'logo'), 
    validate(updatePartenariatSchema), 
    partenariatController.update.bind(partenariatController)
);

/**
 * @route   DELETE /api/partenariats/:id
 * @desc    Supprimer un partenariat
 */
router.delete('/:id', partenariatController.delete.bind(partenariatController));

module.exports = router;
