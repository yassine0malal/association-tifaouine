const Joi = require('joi');

const createPartenariatSchema = Joi.object({
    nom: Joi.string().min(2).max(200).required(),
    logo: Joi.string().max(500).optional().allow('', null),
    description_fr: Joi.string().min(2).max(200).required(),
    description_ar: Joi.string().min(2).max(200).required(),
    description_en: Joi.string().min(2).max(200).required(),
    site_web: Joi.string().uri().max(255).optional().allow('', null)
});

const updatePartenariatSchema = Joi.object({
    nom: Joi.string().min(2).max(200).optional(),
    logo: Joi.string().max(500).optional().allow('', null),
    description_fr: Joi.string().min(2).max(200).optional(),
    description_ar: Joi.string().min(2).max(200).optional(),
    description_en: Joi.string().min(2).max(200).optional(),
    site_web: Joi.string().uri().max(255).optional().allow('', null)
}).min(1);

module.exports = { createPartenariatSchema, updatePartenariatSchema };
