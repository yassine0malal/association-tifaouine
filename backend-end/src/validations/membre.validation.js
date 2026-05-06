const Joi = require('joi');

const createMembreSchema = Joi.object({
    nom: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().max(180).required(),
    poste: Joi.string().max(100).optional().allow('', null),
    description_poste_fr: Joi.string().optional().allow('', null),
    description_poste_ar: Joi.string().optional().allow('', null),
    description_poste_en: Joi.string().optional().allow('', null),
    telephone: Joi.string().max(20).optional().allow('', null),
    competences: Joi.string().optional().allow('', null),
    adresse: Joi.string().max(255).optional().allow('', null),
    motivation: Joi.string().optional().allow('', null),
    date_adhesion: Joi.date().iso().optional().allow(null),
    status: Joi.string().valid('actif', 'inactif', 'suspendu', 'en_attente').required()
});

const updateMembreSchema = Joi.object({
    nom: Joi.string().min(2).max(120).optional(),
    email: Joi.string().email().max(180).optional(),
    poste: Joi.string().max(100).optional().allow('', null),
    description_poste_fr: Joi.string().optional().allow('', null),
    description_poste_ar: Joi.string().optional().allow('', null),
    description_poste_en: Joi.string().optional().allow('', null),
    telephone: Joi.string().max(20).optional().allow('', null),
    competences: Joi.string().optional().allow('', null),
    adresse: Joi.string().max(255).optional().allow('', null),
    motivation: Joi.string().optional().allow('', null),
    date_adhesion: Joi.date().iso().optional().allow(null),
    status: Joi.string().valid('actif', 'inactif', 'suspendu', 'en_attente').optional()
}).min(1);

module.exports = { createMembreSchema, updateMembreSchema };
