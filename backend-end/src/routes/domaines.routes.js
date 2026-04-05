const express = require('express');
const router = express.Router();
const domaineController = require('../controllers/domaine.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Routes publiques (lecture seule)
router.get('/', domaineController.getAll.bind(domaineController));
router.get('/:id', domaineController.getById.bind(domaineController));

// Routes privées (Admin seulement) protégées par authentification
router.use(verifyToken);
router.use(isAdmin);

router.post('/', uploadMiddleware('domaines', 'icone'), domaineController.create.bind(domaineController));
router.put('/:id', uploadMiddleware('domaines', 'icone'), domaineController.update.bind(domaineController));
router.delete('/:id', domaineController.delete.bind(domaineController));

module.exports = router;
