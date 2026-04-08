const Joi = require('joi');

const createRessourceSchema = Joi.object({
    projet_id: Joi.number().integer().optional().allow(null),
    type: Joi.string().valid('photo', 'video', 'rapport', 'guide', 'document').required(),
    titre_fr: Joi.string().min(2).max(255).optional().allow('', null),
    titre_ar: Joi.string().min(2).max(255).optional().allow('', null),
    titre_en: Joi.string().min(2).max(255).optional().allow('', null)
});

const updateRessourceSchema = Joi.object({
    projet_id: Joi.number().integer().optional().allow(null),
    type: Joi.string().valid('photo', 'video', 'rapport', 'guide', 'document').optional(),
    titre_fr: Joi.string().min(2).max(255).optional().allow('', null),
    titre_ar: Joi.string().min(2).max(255).optional().allow('', null),
    titre_en: Joi.string().min(2).max(255).optional().allow('', null)
}).min(1);

module.exports = { createRessourceSchema, updateRessourceSchema };
