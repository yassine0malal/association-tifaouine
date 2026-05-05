const express = require('express');
const router = express.Router();
const benevoleController = require('../controllers/benevole.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { uploadSimple, uploadBenevoleAdmin } = require('../middlewares/upload.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createBenevoleSchema, updateBenevoleSchema } = require('../validations/benevole.validation');

router.get('/', paginate, benevoleController.getAll);

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
router.post('/', uploadBenevoleAdmin, validate(createBenevoleSchema), benevoleController.create);

/**
 * @route   PUT /api/benevoles/:id
 * @desc    Mettre à jour un bénévole
 */
router.put('/:id', uploadBenevoleAdmin, validate(updateBenevoleSchema), benevoleController.update);

/**
 * @route   DELETE /api/benevoles/:id
 * @desc    Supprimer un bénévole
 */
router.delete('/:id', benevoleController.delete);

module.exports = router;
