const Joi = require('joi');

const createDomaineSchema = Joi.object({
    nom_fr: Joi.string().min(2).max(120).required(),
    nom_ar: Joi.string().min(2).max(120).required(),
    nom_en: Joi.string().min(2).max(120).required(),
    desc_fr: Joi.string().max(1000).optional().allow('', null),
    desc_ar: Joi.string().max(1000).optional().allow('', null),
    desc_en: Joi.string().max(1000).optional().allow('', null),
    icone: Joi.string().max(80).optional().allow('', null)
});

const updateDomaineSchema = Joi.object({
    nom_fr: Joi.string().min(2).max(120).optional(),
    nom_ar: Joi.string().min(2).max(120).optional(),
    nom_en: Joi.string().min(2).max(120).optional(),
    desc_fr: Joi.string().max(1000).optional().allow('', null),
    desc_ar: Joi.string().max(1000).optional().allow('', null),
    desc_en: Joi.string().max(1000).optional().allow('', null),
    icone: Joi.string().max(80).optional().allow('', null)
}).min(1);

module.exports = { createDomaineSchema, updateDomaineSchema };
