const express = require('express');
const router = express.Router();
const domaineController = require('../controllers/domaine.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { uploadSimple } = require('../middlewares/upload.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createDomaineSchema, updateDomaineSchema } = require('../validations/domaine.validation');


// Routes privées (Admin seulement) protégées par authentification
router.use(verifyToken);
router.use(isAdmin);

router.get('/admin/all', domaineController.getAllWithStats.bind(domaineController));
router.get('/admin/:id', domaineController.getByIdWithStats.bind(domaineController));
router.post('/admin', uploadSimple('domaines', 'icone'), validate(createDomaineSchema), domaineController.create.bind(domaineController));
router.put('/admin/:id', uploadSimple('domaines', 'icone'), validate(updateDomaineSchema), domaineController.update.bind(domaineController));
router.delete('/admin/:id', domaineController.delete.bind(domaineController));

module.exports = router;
