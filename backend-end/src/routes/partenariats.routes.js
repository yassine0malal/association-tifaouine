const express = require('express');
const router = express.Router();
const partenariatController = require('../controllers/partenariat.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { uploadSimple } = require('../middlewares/upload.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createPartenariatSchema, updatePartenariatSchema } = require('../validations/partenariat.validation');

// --- ROUTES PUBLIQUES (avant les routes protégées) ---
router.get('/', paginate, partenariatController.getAll.bind(partenariatController));

// --- ROUTES PRIVÉES (Admin seulement) ---
// IMPORTANT: Les routes spécifiques /admin/* doivent être AVANT les routes génériques /:id

router.get('/admin/all', verifyToken, isAdmin, partenariatController.getAllWithStats.bind(partenariatController));
router.get('/admin/:id', verifyToken, isAdmin, partenariatController.getByIdWithStats.bind(partenariatController));
router.post('/admin', verifyToken,isAdmin,uploadSimple('partenariats', 'logo'), validate(createPartenariatSchema), partenariatController.create.bind(partenariatController));
router.put('/admin/:id',verifyToken,isAdmin,uploadSimple('partenariats', 'logo'), validate(updatePartenariatSchema), partenariatController.update.bind(partenariatController));
router.delete('/admin/:id', verifyToken, isAdmin, partenariatController.delete.bind(partenariatController));


// router.get('/:id', partenariatController.getById.bind(partenariatController));

module.exports = router;
