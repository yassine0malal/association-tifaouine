const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  if (!schema) return next();

  const { error, value } = schema.validate(req.body, { 
    abortEarly: false, 
    stripUnknown: true 
  });

  if (error) {
    console.log("Validation failed in middleware");
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: 'error',
      message: 'Erreur de validation des données',
      errors: errorMessages
    });
  }

  // CRITICAL: Update req.body with the validated and stripped value
  req.body = value; 
  next();
};

module.exports = { validate };
