const Joi = require('joi');

// Normalise les valeurs lisibles vers les valeurs DB
// ex: "En cours" → "en_cours"
const STATUT_MAP = {
    'planifie':  'planifie',
    'en_cours':  'en_cours',
    'termine':   'termine',
    'suspendu':  'suspendu',
    'En cours':  'en_cours',
    'Planifié':  'planifie',
    'Terminé':   'termine',
    'Suspendu':  'suspendu'
};

const createProjetSchema = Joi.object({
    domaine_id:       Joi.number().integer().required(),
    titre_fr:         Joi.string().min(2).max(255).required(),
    titre_ar:         Joi.string().min(2).max(255).required(),
    titre_en:         Joi.string().min(2).max(255).required(),
    description_fr:   Joi.string().optional().allow('', null),
    description_ar:   Joi.string().optional().allow('', null),
    description_en:   Joi.string().optional().allow('', null),
    statut:           Joi.string().valid(...Object.keys(STATUT_MAP)).default('en_cours').required(),
    localisation:     Joi.string().max(150).optional().allow('', null),
    nb_beneficiaires: Joi.number().integer().min(0).optional().default(0),
    date_debut:       Joi.date().iso().optional().allow(null),
    date_fin:         Joi.date().iso().greater(Joi.ref('date_debut')).optional().allow(null).messages({
        'date.greater': 'La date de fin doit être après la date de début'
    }),
    budget:           Joi.number().precision(2).required(),
    partenariat_ids:  Joi.alternatives().try(
        Joi.array().items(Joi.number().integer()),
        Joi.number().integer()
    ).optional().default([]),
    image_principale: Joi.string().max(500).optional().allow('', null)
});

const createProjetCompletSchema = Joi.object({
    domaine_id:       Joi.number().integer().required(),
    titre_fr:         Joi.string().min(2).max(255).required(),
    titre_ar:         Joi.string().min(2).max(255).required(),
    titre_en:         Joi.string().min(2).max(255).required(),
    description_fr:   Joi.string().optional().allow('', null),
    description_ar:   Joi.string().optional().allow('', null),
    description_en:   Joi.string().optional().allow('', null),
    statut:           Joi.string().valid(...Object.keys(STATUT_MAP)).default('en_cours').required(),
    localisation:     Joi.string().max(150).optional().allow('', null),
    nb_beneficiaires: Joi.number().integer().min(0).optional().default(0),
    date_debut:       Joi.date().iso().optional().allow(null),
    date_fin:         Joi.date().iso().greater(Joi.ref('date_debut')).optional().allow(null).messages({
        'date.greater': 'La date de fin doit être après la date de début'
    }),
    budget:           Joi.number().precision(2).required(),
    partenariat_ids:  Joi.alternatives().try(
        Joi.array().items(Joi.number().integer()),
        Joi.number().integer()
    ).optional().default([])
    // imagePrincipale et extraImages sont des fichiers multipart, pas validés par Joi
});

const updateProjetSchema = Joi.object({
    domaine_id: Joi.number().integer().optional(),
    titre_fr: Joi.string().min(2).max(255).optional(),
    titre_ar: Joi.string().min(2).max(255).optional(),
    titre_en: Joi.string().min(2).max(255).optional(),
    description_fr: Joi.string().optional().allow('', null),
    description_ar: Joi.string().optional().allow('', null),
    description_en: Joi.string().optional().allow('', null),
    statut: Joi.string().valid('planifie', 'en_cours', 'termine', 'suspendu').optional(),
    localisation: Joi.string().max(150).optional().allow('', null),
    nb_beneficiaires: Joi.number().integer().min(0).optional(),
    date_debut: Joi.date().iso().optional().allow(null),
    date_fin: Joi.date().iso().greater(Joi.ref('date_debut')).optional().allow(null).messages({
        'date.greater': 'La date de fin doit être après la date de début'
    }),
    budget: Joi.number().precision(2).optional(),
    partenariat_ids: Joi.alternatives().try(
        Joi.array().items(Joi.number().integer()),
        Joi.number().integer()
    ).optional(),
    image_principale: Joi.string().max(500).optional().allow('', null)
}).min(1);

const updateProjetCompletSchema = Joi.object({
    domaine_id:              Joi.number().integer().optional(),
    titre_fr:                Joi.string().min(2).max(255).optional(),
    titre_ar:                Joi.string().min(2).max(255).optional(),
    titre_en:                Joi.string().min(2).max(255).optional(),
    description_fr:          Joi.string().optional().allow('', null),
    description_ar:          Joi.string().optional().allow('', null),
    description_en:          Joi.string().optional().allow('', null),
    statut:                  Joi.string().valid(...Object.keys(STATUT_MAP)).optional(),
    localisation:            Joi.string().max(150).optional().allow('', null),
    nb_beneficiaires:        Joi.number().integer().min(0).optional(),
    date_debut:              Joi.date().iso().optional().allow(null),
    date_fin:                Joi.date().iso().optional().allow(null),
    budget:                  Joi.number().precision(2).optional(),
    partenariat_ids:         Joi.alternatives().try(
        Joi.array().items(Joi.number().integer()),
        Joi.number().integer()
    ).optional(),
    existingImagePrincipale: Joi.string().optional().allow('', null),
    existingExtraImages:     Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional().default([]),
    existingVideos:          Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional().default([])
}).min(1);

module.exports = { createProjetSchema, createProjetCompletSchema, updateProjetSchema, updateProjetCompletSchema, STATUT_MAP };
