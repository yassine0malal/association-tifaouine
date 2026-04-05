const Joi = require('joi');

const createMembreSchema = Joi.object({
    nom: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().max(180).required(),
    poste: Joi.string().max(100).optional().allow('', null),
    status: Joi.string().valid('actif', 'inactif', 'suspendu').required()
});

const updateMembreSchema = Joi.object({
    nom: Joi.string().min(2).max(120).optional(),
    email: Joi.string().email().max(180).optional(),
    poste: Joi.string().max(100).optional().allow('', null),
    status: Joi.string().valid('actif', 'inactif', 'suspendu').optional()
}).min(1);

module.exports = { createMembreSchema, updateMembreSchema };
