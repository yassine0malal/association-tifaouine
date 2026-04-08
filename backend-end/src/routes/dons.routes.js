const express = require('express');
const router = express.Router();
const donController = require('../controllers/don.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// --- Don Financier ---
// @route  POST /api/dons/financier  — Public (visiteur du site)
router.post('/financier', donController.createFinancier);

// --- Don Matériel ---
// @route  POST /api/dons/materiel  — Admin (saisie d'un don physique reçu)
router.post('/materiel', verifyToken, isAdmin, donController.createMateriel);

// --- Consultation & Gestion (Admin) ---
// @route  GET /api/dons  — filtres: type_don, statut, type_destination, projet_id
router.get('/', verifyToken, isAdmin, donController.getAll);

// @route  GET /api/dons/:id
router.get('/:id', verifyToken, isAdmin, donController.getById);

// @route  PATCH /api/dons/:id/statut  — ex: passer un don financier de 'en_attente' à 'recu'
router.patch('/:id/statut', verifyToken, isAdmin, donController.updateStatut);

// @route  DELETE /api/dons/:id
router.delete('/:id', verifyToken, isAdmin, donController.delete);

module.exports = router;
