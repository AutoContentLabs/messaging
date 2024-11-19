/**
 * src\utils\validator.js
 */

const Ajv = require('ajv');
const validator = new Ajv(); // validator engine
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
    return validate.errors;
  }
  // valid
  return null;
}

module.exports = { validateData };