const express = require('express');
const router = express.Router();
const adminNotificationRoutes = require('./adminNotification.routes');
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Les routes pour les notifications (ex: /api/admin/notifications)
router.use('/notifications', adminNotificationRoutes);

// Dashboard stats (ex: GET /api/admin/dashboard)
router.get('/dashboard', verifyToken, isAdmin, dashboardController.getStats.bind(dashboardController));

module.exports = router;

