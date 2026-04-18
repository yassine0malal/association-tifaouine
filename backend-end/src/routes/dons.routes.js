const express = require('express');
const router = express.Router();
const donController = require('../controllers/don.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createDonFinancierSchema, createDonMaterielSchema, updateStatutDonSchema } = require('../validations/don.validation');

router.post('/financier', validate(createDonFinancierSchema), donController.createFinancier);
router.post('/materiel', verifyToken, isAdmin, validate(createDonMaterielSchema), donController.createMateriel);
router.get('/', verifyToken, isAdmin, paginate, donController.getAll);
router.get('/:id', verifyToken, isAdmin, donController.getById);
router.patch('/:id/statut', verifyToken, isAdmin, validate(updateStatutDonSchema), donController.updateStatut);
router.delete('/:id', verifyToken, isAdmin, donController.delete);

module.exports = router;
