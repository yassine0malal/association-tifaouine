const Joi = require('joi');

const createBenevoleSchema = Joi.object({
    nom: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().max(180).required(),
    mession: Joi.string().max(250).optional().allow('', null),
    disponibilite: Joi.string().max(250).optional().allow('', null),
    telephone: Joi.string().max(20).optional().allow('', null),
    competences: Joi.string().optional().allow('', null),
    adresse: Joi.string().max(255).optional().allow('', null),
    motivation: Joi.string().optional().allow('', null),
    date_adhesion: Joi.date().optional(),
    status: Joi.string().valid('actif', 'inactif', 'suspendu').required()
});


const updateBenevoleSchema = Joi.object({
    nom: Joi.string().min(2).max(120).optional(),
    email: Joi.string().email().max(180).optional(),
    mession: Joi.string().max(250).optional().allow('', null),
    disponibilite: Joi.string().max(250).optional().allow('', null),
    telephone: Joi.string().max(20).optional().allow('', null),
    competences: Joi.string().optional().allow('', null),
    adresse: Joi.string().max(255).optional().allow('', null),
    motivation: Joi.string().optional().allow('', null),
    date_adhesion: Joi.date().optional(),
    status: Joi.string().valid('actif', 'inactif', 'suspendu').optional()
}).min(1);

module.exports = { createBenevoleSchema, updateBenevoleSchema };
