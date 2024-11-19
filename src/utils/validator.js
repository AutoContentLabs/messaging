/**
 * src\utils\validator.js
 */

const Ajv = require('ajv');
const validator = new Ajv({ allErrors: true });
const schemas = require("../schemas")
const addFormats = require("ajv-formats")
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
      if (error.keyword === 'required') {
        return `Required field missing: ${error.params.missingProperty}`;
      } else if (error.keyword === 'additionalProperties') {
        return `Unexpected field: ${error.params.additionalProperty}`;
      } else {
        return `${error.message}`;
      }
    });

    console.error(`Validation failed with the following errors:`);
    formattedErrors.forEach(error => {
      console.error(`- ${error}`);
    });
  }
  // valid
  return null;
}

module.exports = { validateData };