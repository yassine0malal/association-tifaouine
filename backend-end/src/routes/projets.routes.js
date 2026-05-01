const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { uploadProjetPrincipal, uploadProjetComplet } = require('../middlewares/upload.middleware');
const { createProjetSchema, createProjetCompletSchema, updateProjetSchema } = require('../validations/projet.validation');

router.get('/', paginate, projetController.getAll.bind(projetController));

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
router.post(
    '/', 
    uploadProjetPrincipal, 
    validate(createProjetSchema), 
    projetController.create.bind(projetController)
);

/**
 * @route   POST /api/projets/complet
 * @desc    Créer un projet avec image principale + galerie + vidéos en une seule requête
 * @body    FormData: champs projet + imagePrincipale (file) + extraImages[] + extraVideos[]
 */
router.post(
    '/complet',
    uploadProjetComplet,
    validate(createProjetCompletSchema),
    projetController.createComplet.bind(projetController)
);

/**
 * @route   PUT /api/projets/complet/:id
 * @desc    Mettre à jour un projet complet (champs + fichiers optionnels)
 */
router.put(
    '/complet/:id',
    uploadProjetComplet,
    validate(updateProjetSchema),
    projetController.updateComplet.bind(projetController)
);

/**
 * @route   DELETE /api/projets/complet/:id
 * @desc    Supprimer un projet et toutes ses ressources (fichiers physiques + DB)
 */
router.delete('/complet/:id', projetController.deleteComplet.bind(projetController));

/**
 * @route   PUT /api/projets/:id
 * @desc    Mettre à jour un projet
 */
router.put(
    '/:id', 
    uploadProjetPrincipal, 
    validate(updateProjetSchema), 
    projetController.update.bind(projetController)
);

/**
 * @route   DELETE /api/projets/:id
 * @desc    Supprimer un projet
 */
router.delete('/:id', projetController.delete.bind(projetController));

module.exports = router;
