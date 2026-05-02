const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { paginate } = require('../middlewares/pagination.middleware');
const { createMessageSchema, updateMessageStatusSchema } = require('../validations/message.validation');

router.post('/', validate(createMessageSchema), messageController.create.bind(messageController));

router.get('/stats', verifyToken, isAdmin, messageController.getStats.bind(messageController));
router.get('/', verifyToken, isAdmin, paginate, messageController.getAll.bind(messageController));
router.get('/:id', verifyToken, isAdmin, messageController.getById.bind(messageController));
router.put('/:id', verifyToken, isAdmin, validate(updateMessageStatusSchema), messageController.updateStatus.bind(messageController));
router.delete('/:id', verifyToken, isAdmin, messageController.delete.bind(messageController));

module.exports = router;
