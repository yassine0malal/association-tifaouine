const express = require('express');
const router = express.Router();
const domaineController = require('../controllers/domaine.controller');

// routes pour les visiteurs et publiques car sur le frontend on n'a pas besoin de login pour voir les domaines
router.get('/', domaineController.getAll.bind(domaineController));
router.get('/:id', domaineController.getById.bind(domaineController));

// ces routes doivent etre pour l'admin, pour le moment on les ajoute et on mettra le middleware jwt plus tard selon le cdc
router.post('/', domaineController.create.bind(domaineController));
router.put('/:id', domaineController.update.bind(domaineController));
router.delete('/:id', domaineController.delete.bind(domaineController));

module.exports = router;
