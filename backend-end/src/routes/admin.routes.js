const express = require('express');
const router = express.Router();
const adminNotificationRoutes = require('./adminNotification.routes');

// Les routes pour les notifications (ex: /api/admin/notifications)
router.use('/notifications', adminNotificationRoutes);

module.exports = router;

