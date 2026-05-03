const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { authLimiter, refreshLimiter } = require('../middlewares/rateLimit.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { loginSchema, updateProfileSchema } = require('../validations/auth.validation');

// @route  POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// @route  POST /api/auth/refresh-token
router.post('/refresh-token', refreshLimiter, authController.refreshToken);

// @route  POST /api/auth/logout
router.post('/logout', verifyToken, isAdmin, authController.logout);

// @route  GET /api/auth/profile
router.get('/profile', verifyToken, isAdmin, authController.getProfile);

// @route  PATCH /api/auth/update-profile
router.patch('/update-profile', verifyToken, isAdmin, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
