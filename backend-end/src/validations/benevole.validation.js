const Joi = require('joi');

const createBenevoleSchema = Joi.object({
    nom: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().max(180).required(),
    mession: Joi.string().max(250).optional().allow('', null),
    disponibilite: Joi.string().max(250).optional().allow('', null),
    status: Joi.string().valid('actif', 'inactif', 'suspendu').required()
});

const updateBenevoleSchema = Joi.object({
    nom: Joi.string().min(2).max(120).optional(),
    email: Joi.string().email().max(180).optional(),
    mession: Joi.string().max(250).optional().allow('', null),
    disponibilite: Joi.string().max(250).optional().allow('', null),
    status: Joi.string().valid('actif', 'inactif', 'suspendu').optional()
}).min(1);

module.exports = { createBenevoleSchema, updateBenevoleSchema };
