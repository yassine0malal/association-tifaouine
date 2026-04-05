const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createMessageSchema, updateMessageStatusSchema } = require('../validations/message.validation');

// Route publique pour soumettre le formulaire (Pas de middleware d'auth req)
router.post('/', validate(createMessageSchema), messageController.create.bind(messageController));

// Routes privées et sécurisées (Réservé à l'Admin)
router.get('/', verifyToken, isAdmin, messageController.getAll.bind(messageController));
router.get('/:id', verifyToken, isAdmin, messageController.getById.bind(messageController));
router.put('/:id', verifyToken, isAdmin, validate(updateMessageStatusSchema), messageController.updateStatus.bind(messageController));
router.delete('/:id', verifyToken, isAdmin, messageController.delete.bind(messageController));

module.exports = router;
