const Joi = require('joi');

const createMessageSchema = Joi.object({
    nom_complet: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().max(180).required(),
    objet: Joi.string().valid('DEMANDE_PARTENARIAT', 'DEMANDE_BENEVOLE', 'DEMANDE_MEMBRE', 'DEMANDE_SERVICE', 'DEMANDE_INFORMATION').required(),
    message: Joi.string().min(10).required()
});

const updateMessageStatusSchema = Joi.object({
    lu: Joi.boolean().required()
});

module.exports = { createMessageSchema, updateMessageStatusSchema };
