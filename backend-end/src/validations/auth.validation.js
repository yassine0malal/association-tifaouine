const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez fournir une adresse email valide',
    'any.required': 'L\'email est obligatoire'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est obligatoire'
  })
});

const updateProfileSchema = Joi.object({
  nom: Joi.string().min(2).max(120).optional(),
  email: Joi.string().email().max(180).optional()
}).min(1).messages({
  'object.min': 'Veuillez fournir au moins un champ à mettre à jour'
});

module.exports = { loginSchema, updateProfileSchema };
