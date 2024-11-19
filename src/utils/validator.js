/**
 * src\utils\validator.js
 */

const Ajv = require('ajv');
const validator = new Ajv(); // validator engine

const schemas = {
  DATA_COLLECT_REQUEST: {
    type: "object",
    properties: {
      id: { type: "string" },
      source: { type: "string" },
      params: { type: "object" },
    },
    required: ["id", "source"],
    additionalProperties: false,
  },
  DATA_COLLECT_STATUS: {
    type: "object",
    properties: {
      id: { type: "string" },
      status: { type: "string", enum: ["pending", "in_progress", "completed", "failed"] },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "status"],
    additionalProperties: false,
  },
  ALERT: {
    type: "object",
    properties: {
      content: { type: "string" },
      level: { type: "string", enum: ["emerg", "alert", "crit", "error", "warning", "notice", "info", "debug"] },
    },
    required: ["content", "level"],
    additionalProperties: false,
  },
  JOB_SCHEDULE_CREATE: {
    type: "object",
    properties: {
      jobId: { type: "string" },
      schedule: { type: "string", format: "date-time" },
    },
    required: ["jobId", "schedule"],
    additionalProperties: false,
  },

};


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