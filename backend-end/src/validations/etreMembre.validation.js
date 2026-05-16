const Joi = require('joi');

const etreMembre = Joi.object({
    fullname:     Joi.string().min(2).max(120).required(),
    email:        Joi.string().email().max(180).required(),
    phone_number: Joi.string().pattern(/^\+?[\d\s\-().]{7,20}$/).required(),
    skills:       Joi.string().min(2).max(1000).optional().allow(''),
    address:      Joi.string().min(2).max(255).required(),
    motivation:   Joi.string().min(10).max(3000).required(),
    // Champ honeypot — doit toujours être vide
    website:      Joi.string().allow('').optional()
});

module.exports = { etreMembre };
