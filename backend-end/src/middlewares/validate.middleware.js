const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  if (!schema) return next();

  // Validate req.body against the provided schema
  // abortEarly: false - returns all errors instead of stopping at the first one
  // stripUnknown: true - removes any fields from the object that are not defined in the schema
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: 'error',
      message: 'Erreur de validation des données',
      errors: errorMessages
    });
  }

  // Assign the sanitized/validated value back to req.body
  req.body = value;
  next();
};

module.exports = { validate };
