const express = require('express');
const router = express.Router();
const statController = require('../controllers/stat.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Route publique - Récupérer les stats pour les afficher sur la page d'accueil (Le frontend l'utilise)
router.get('/', statController.getAll.bind(statController));

// Route 'Jocker' pour recalculer les statistiques dynamiquement depuis toute la base de données
router.post('/sync', verifyToken, isAdmin, statController.sync.bind(statController));

// Routes de gestion manuelle des stats personnalisées (Admin uniquement)
router.post('/', verifyToken, isAdmin, statController.create.bind(statController));
router.put('/:id', verifyToken, isAdmin, statController.update.bind(statController));
router.delete('/:id', verifyToken, isAdmin, statController.delete.bind(statController));

module.exports = router;
