const express = require('express');
const router = express.Router();
const ressourceController = require('../controllers/ressource.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { uploadRessources } = require('../middlewares/upload.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createRessourceSchema, updateRessourceSchema } = require('../validations/ressource.validation');

router.get('/', paginate, ressourceController.getAll.bind(ressourceController));
router.get('/:id', ressourceController.getById.bind(ressourceController));

// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   POST /api/ressources
 * @desc    Upload et enregistrement d'une ressource (Photo, Video, Rapport, Document)
 * @access  Admin
 */
router.post(
    '/', 
    uploadRessources, 
    validate(createRessourceSchema), 
    ressourceController.create.bind(ressourceController)
);

/**
 * @route   PUT /api/ressources/:id
 * @desc    Mise à jour des métadonnées d'une ressource
 * @access  Admin
 */
router.put(
    '/:id', 
    validate(updateRessourceSchema), 
    ressourceController.update.bind(ressourceController)
);

/**
 * @route   DELETE /api/ressources/:id
 * @desc    Suppression de la ressource (Base de données et fichier physique)
 * @access  Admin
 */
router.delete('/:id', ressourceController.delete.bind(ressourceController));

module.exports = router;
