const Joi = require('joi');

const etreBenevole = Joi.object({
    fullname:     Joi.string().min(2).max(120).required(),
    email:        Joi.string().email().max(180).required(),
    phone_number: Joi.string().pattern(/^\+?[\d\s\-().]{7,20}$/).required(),
    skills:       Joi.string().min(2).max(1000).required(),
    address:      Joi.string().min(2).max(255).required(),
    motivation:   Joi.string().min(10).max(3000).required(),
    availability: Joi.string().min(2).max(250).required(),
    // Champ honeypot — doit toujours être vide
    website:      Joi.string().allow('').optional()
});

module.exports = { etreBenevole };
