const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenement.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createEvenementSchema, updateEvenementSchema } = require('../validations/evenement.validation');
const { uploadEvenementComplet } = require('../middlewares/upload.middleware');

// --- ROUTES PRIVÉES (Admin seulement) ---
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   GET /api/evenements/admin/all
 * @desc    Récupérer tous les événements (Admin)
 */
router.get('/admin/all', paginate, evenementController.getAll.bind(evenementController));

/**
 * @route   GET /api/evenements/admin/complet/:id
 * @desc    Récupérer un événement complet avec images (pour formulaire d'édition admin)
 */
router.get('/admin/complet/:id', evenementController.getByIdComplet.bind(evenementController));

/**
 * @route   POST /api/evenements/complet
 * @desc    Créer un événement avec image principale + galerie
 */
router.post('/complet', uploadEvenementComplet, validate(createEvenementSchema), evenementController.createComplet.bind(evenementController));

/**
 * @route   PUT /api/evenements/complet/:id
 * @desc    Mettre à jour un événement complet (champs + fichiers optionnels)
 */
router.put('/complet/:id', uploadEvenementComplet, validate(updateEvenementSchema), evenementController.updateComplet.bind(evenementController));

/**
 * @route   DELETE /api/evenements/complet/:id
 * @desc    Supprimer un événement et toutes ses ressources
 */
router.delete('/complet/:id', evenementController.deleteComplet.bind(evenementController));

module.exports = router;
