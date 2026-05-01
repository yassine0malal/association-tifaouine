const express = require('express');
const router = express.Router({ mergeParams: true });

const projetController      = require('../controllers/projet.controller');
const evenementController   = require('../controllers/evenement.controller');
const domaineController     = require('../controllers/domaine.controller');
const membreController      = require('../controllers/membre.controller');
const benevoleController    = require('../controllers/benevole.controller');
const partenariatController = require('../controllers/partenariat.controller');
const ressourceController   = require('../controllers/ressource.controller');
const { paginate } = require('../middlewares/pagination.middleware');

// Le middleware validateLang est appliqué dans index.js avant ce router

// ─── Domaines 
router.get('/domaines-navbar', domaineController.getAllByLang.bind(domaineController));
router.get('/domaines',        domaineController.getAllFullByLang.bind(domaineController));
// ─── Projets 
router.get('/projets',paginate, projetController.getAllByLang.bind(projetController));
router.get('/projets/:id/images',paginate, projetController.getImagesByLang.bind(projetController));
router.get('/projets/:id',projetController.getByIdAndLang.bind(projetController));
router.get('/project-for-don',projetController.getAllByLangForDon.bind(projetController));
router.get('/projet-admin',paginate, projetController.getAllByLangForAdmin.bind(projetController));


// add autre api qui contient seulement le id de projet et son nom 
// ─── Événements 
router.get('/evenements',paginate, evenementController.getAllByLang.bind(evenementController));
router.get('/evenements/:id',evenementController.getByIdAndLang.bind(evenementController));

// ─── Membres 
router.get('/membres', membreController.getAllByLang.bind(membreController));

// ─── Bénévoles 
router.get('/benevoles',paginate, benevoleController.getAllByLang.bind(benevoleController));

// ─── Partenariats
router.get('/partenariats', partenariatController.getAllByLang.bind(partenariatController));

router.get('/partenariats-home', partenariatController.getAllByLangForHome.bind(partenariatController));

// ─── Ressources documents de l'association
router.get('/ressources/documents', paginate, ressourceController.getDocumentsAssociation.bind(ressourceController));

module.exports = router;


