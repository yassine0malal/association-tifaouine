const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const membreRoutes = require('./membre.routes');
const benevoleRoutes = require('./benevole.routes');
const projetsRoutes = require('./projets.routes');
const domainesRoutes = require('./domaines.routes');
const evenementsRoutes = require('./evenements.routes');
const donsRoutes = require('./dons.routes');
const mediasRoutes = require('./medias.routes');
const ressourcesRoutes = require('./ressources.routes');
const partenariatsRoutes = require('./partenariats.routes');
const messagesRoutes = require('./messages.routes');
const statsRoutes = require('./stats.routes');
const { apiLimiter } = require('../middlewares/rateLimit.middleware');

router.use(apiLimiter);

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/membres', membreRoutes);
router.use('/benevoles', benevoleRoutes);
router.use('/projets', projetsRoutes);
router.use('/domaines', domainesRoutes);
router.use('/evenements', evenementsRoutes);
router.use('/dons', donsRoutes);
router.use('/medias', mediasRoutes);
router.use('/ressources', ressourcesRoutes);
router.use('/partenariats', partenariatsRoutes);
router.use('/messages', messagesRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
