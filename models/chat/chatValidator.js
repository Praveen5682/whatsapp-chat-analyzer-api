const Joi = require("joi");

const chatUploadSchemaValidation = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required().messages({
      "any.required": "File name is required",
      "string.base": "File name must be a string",
    }),
    mimetype: Joi.string().valid("text/plain").required().messages({
      "any.required": "File type is required",
      "any.only": "Only plain text files are allowed",
    }),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        "any.required": "File size is required",
        "number.max": "File size should not exceed 5MB",
        "number.base": "File size must be a number",
      }),
    path: Joi.string().required().messages({
      "any.required": "File path is required",
      "string.base": "File path must be a string",
    }),
  })
    .required()
    .messages({
      "any.required": "File must be uploaded",
      "object.base": "File must be an object",
    }),
});

module.exports = chatUploadSchemaValidation;
