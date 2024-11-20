/**
 * src\models\createModel.js
 */

const Model = require("./model");
const schemas = require("../schemas");

function createModel(schemaName, eventName) {
  if (!schemas[schemaName]) {
    throw new Error(`Schema ${schemaName} not found`);
  }
  return new Model(eventName, schemaName);
}

module.exports = { createModel };
