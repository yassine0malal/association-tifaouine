const Joi = require('joi');

const createEvenementSchema = Joi.object({
    domaine_id: Joi.number().integer().required(),
    projet_id: Joi.number().integer().optional().allow(null, ''),
    titre_fr: Joi.string().min(2).max(255).required(),
    titre_ar: Joi.string().min(2).max(255).required(),
    titre_en: Joi.string().min(2).max(255).required(),
    date_debut: Joi.date().iso().required(),
    date_fin: Joi.date().iso().greater(Joi.ref('date_debut')).optional().allow(null, '').messages({
        'date.greater': 'La date de fin doit être après la date de début'
    }),
    lieu: Joi.string().max(200).optional().allow('', null),
    description_fr: Joi.string().max(2000).optional().allow('', null),
    description_ar: Joi.string().max(2000).optional().allow('', null),
    description_en: Joi.string().max(2000).optional().allow('', null),
    partenariat_ids: Joi.array().items(Joi.number().integer()).optional().default([])
});

const updateEvenementSchema = Joi.object({
    domaine_id: Joi.number().integer().optional(),
    projet_id: Joi.number().integer().optional().allow(null, ''),
    titre_fr: Joi.string().min(2).max(255).optional(),
    titre_ar: Joi.string().min(2).max(255).optional(),
    titre_en: Joi.string().min(2).max(255).optional(),
    date_debut: Joi.date().iso().optional(),
    date_fin: Joi.date().iso().greater(Joi.ref('date_debut')).optional().allow(null, '').messages({
        'date.greater': 'La date de fin doit être après la date de début'
    }),
    lieu: Joi.string().max(200).optional().allow('', null),
    description_fr: Joi.string().max(2000).optional().allow('', null),
    description_ar: Joi.string().max(2000).optional().allow('', null),
    description_en: Joi.string().max(2000).optional().allow('', null),
    partenariat_ids: Joi.array().items(Joi.number().integer()).optional(),
    // Allow existingExtraImages to pass through validation (used by controller)
    existingExtraImages: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional(),
    'existingExtraImages[]': Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional(),
    // Allow existingImagePrincipale to pass through
    existingImagePrincipale: Joi.string().optional().allow('', null)
}).min(1);

module.exports = { createEvenementSchema, updateEvenementSchema };
