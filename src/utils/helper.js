// src/utils/helper.js
const { v4: uuidv4 } = require('uuid');
const config = require("../transporters/config")

function generateHeaders(schemaType, correlationId) {
    return {
        correlationId: correlationId || uuidv4().toString(),
        traceId: config.CLIENT_ID,
        type: schemaType.toString()
    };
}

function generateKey() {
    return {
        recordId: uuidv4().toString()
    };
}

/**
 * Returns the current timestamp in ISO format.
 * @returns {string} Current timestamp.
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

module.exports = { generateKey, generateHeaders, getCurrentTimestamp };
