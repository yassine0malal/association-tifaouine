const Joi = require('joi');

const createRessourceSchema = Joi.object({
    projet_id:      Joi.number().integer().empty('').default(null).optional().allow(null),
    evenement_id:   Joi.number().integer().empty('').default(null).optional().allow(null),
    type:           Joi.string().valid('photo', 'video', 'rapport', 'guide', 'document').required(),
    titre_fr:       Joi.string().min(2).max(255).optional().allow('', null),
    titre_ar:       Joi.string().min(2).max(255).optional().allow('', null),
    titre_en:       Joi.string().min(2).max(255).optional().allow('', null),
    description_fr: Joi.string().optional().allow('', null),
    description_ar: Joi.string().optional().allow('', null),
    description_en: Joi.string().optional().allow('', null),
    is_featured:    Joi.boolean().empty('').default(false).optional()
});

const updateRessourceSchema = Joi.object({
    projet_id:        Joi.number().integer().empty('').default(null).optional().allow(null),
    evenement_id:     Joi.number().integer().empty('').default(null).optional().allow(null),
    type:             Joi.string().valid('photo', 'video', 'rapport', 'guide', 'document').optional(),
    titre_fr:         Joi.string().min(2).max(255).optional().allow('', null),
    titre_ar:         Joi.string().min(2).max(255).optional().allow('', null),
    titre_en:         Joi.string().min(2).max(255).optional().allow('', null),
    description_fr:   Joi.string().optional().allow('', null),
    description_ar:   Joi.string().optional().allow('', null),
    description_en:   Joi.string().optional().allow('', null),
    image_couverture: Joi.string().max(500).optional().allow('', null),
    is_featured:      Joi.boolean().empty('').optional()
}).min(1);

module.exports = { createRessourceSchema, updateRessourceSchema };
