
const Joi = require('joi');

const validateInput = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
  
  // Define Joi Schema for book resource validation
  const todoSchemaValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    completed: Joi.boolean().default(false),
  });

  module.exports={validateInput,todoSchemaValidation}