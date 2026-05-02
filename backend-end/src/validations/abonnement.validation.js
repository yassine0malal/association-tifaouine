const Joi = require('joi');

/**
 * Validation pour l'abonnement public
 */
const abonnement = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(255)
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'string.max': 'L\'email ne peut pas dépasser 255 caractères',
      'any.required': 'L\'email est requis'
    }),
  
  // Champ honeypot (doit être vide)
  website: Joi.string()
    .allow('')
    .optional()
});

/**
 * Validation pour le désabonnement (seulement email)
 */
const desabonnement = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(255)
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'string.max': 'L\'email ne peut pas dépasser 255 caractères',
      'any.required': 'L\'email est requis'
    })
});

/**
 * Validation pour les filtres admin
 */
const abonnesFilters = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional(),
  
  dateDebut: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Format de date invalide (ISO 8601 requis)'
    }),
  
  dateFin: Joi.date()
    .iso()
    .min(Joi.ref('dateDebut'))
    .optional()
    .messages({
      'date.format': 'Format de date invalide (ISO 8601 requis)',
      'date.min': 'La date de fin doit être postérieure à la date de début'
    })
});

module.exports = {
  abonnement,
  desabonnement,
  abonnesFilters
};