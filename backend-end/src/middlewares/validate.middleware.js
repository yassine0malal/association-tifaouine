const Joi = require('joi');

// middleware/validate.js
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly:    false,
        allowUnknown:  true,   // ← ne pas bloquer les champs inconnus
        stripUnknown:  false,  // ← ne pas supprimer les champs inconnus
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Données invalides",
            errors:  error.details.map(d => d.message)
        });
    }

    req.body = value;
    next();
};

module.exports = validate;

module.exports = { validate };
