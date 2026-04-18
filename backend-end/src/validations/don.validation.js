const Joi = require('joi');

const donBaseSchema = {
    email: Joi.string().email().max(180).required().messages({
        'string.email': "L'email doit être une adresse valide.",
        'any.required': "L'email est obligatoire."
    }),
    nom_complet: Joi.string().min(2).max(150).required().messages({
        'any.required': "Le nom complet est obligatoire."
    }),
    telephone: Joi.string().max(20).optional().allow('', null),
    type_destination: Joi.string().valid('general', 'specifique').required().messages({
        'any.only': "Le type de destination doit être 'general' ou 'specifique'.",
        'any.required': "Le type de destination est obligatoire."
    }),
    projet_id: Joi.when('type_destination', {
        is: 'specifique',
        then: Joi.number().integer().positive().required().messages({
            'any.required': "Un projet_id est requis pour un don spécifique."
        }),
        otherwise: Joi.number().integer().positive().optional().allow(null)
    })
};

const createDonFinancierSchema = Joi.object({
    ...donBaseSchema,
    montant: Joi.number().precision(2).positive().required().messages({
        'number.positive': "Le montant doit être supérieur à 0.",
        'any.required': "Le montant est obligatoire."
    }),
    devise: Joi.string().max(5).optional().default('MAD'),
    ref_transaction: Joi.string().max(100).optional().allow('', null)
});

const createDonMaterielSchema = Joi.object({
    ...donBaseSchema,
    description: Joi.string().min(3).required().messages({
        'any.required': "La description du don matériel est obligatoire."
    }),
    quantite: Joi.number().integer().min(1).optional().default(1).messages({
        'number.min': "La quantité doit être au moins 1."
    }),
    date_decision: Joi.date().iso().optional().allow(null)
});

const updateStatutDonSchema = Joi.object({
    statut: Joi.string().valid('recu', 'en_attente', 'traite').required().messages({
        'any.only': "Statut invalide. Valeurs acceptées : recu, en_attente, traite.",
        'any.required': "Le champ 'statut' est obligatoire."
    })
});

module.exports = { createDonFinancierSchema, createDonMaterielSchema, updateStatutDonSchema };
