/**
 * src\utils\validator.js
 */

const Ajv = require('ajv');
const validator = new Ajv({ allErrors: true });
const schemas = require("../schemas")
const addFormats = require("ajv-formats");
addFormats(validator)
function validateData(schemaType, data) {
  const schema = schemas[schemaType];

  if (!schema) {
    throw new Error(`No schema found for ${schemaType}`);
  }

  const validate = validator.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const formattedErrors = validate.errors.map(error => {
      const fieldPath = error.instancePath || 'Unknown field'; // Get the field path

      // Include the field path in the error message
      if (error.keyword === 'required') {
        return `${fieldPath}: Required field missing`;
      } else if (error.keyword === 'additionalProperties') {
        return `${fieldPath}: Unexpected field`;
      } else {
        return `${fieldPath}: ${error.message}`;
      }
    });

    formattedErrors.forEach(error => {
      console.error(`- ${error}`);
    });

    throw new Error("Validation failed with the following errors"); // Throws errors as JSON for debugging purposes
  }

  // If no errors, return null indicating validation passed
  return null;
}


module.exports = { validateData };