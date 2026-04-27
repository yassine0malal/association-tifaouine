const express = require('express');
const router = express.Router();
const adminNotificationController = require('../controllers/adminNotification.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Toutes les routes sont protégées (login + rôle admin)
router.use(verifyToken, isAdmin);

// GET /api/admin/notifications - Récupérer toutes les notifications
router.get('/', adminNotificationController.getAll);

// GET /api/admin/notifications/unread-count - Récupérer le nombre non lu
router.get('/unread-count', adminNotificationController.getUnreadCount);

// PATCH /api/admin/notifications/:id/read - Marquer comme lue
router.patch('/:id/read', adminNotificationController.markAsRead);

module.exports = router;