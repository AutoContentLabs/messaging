// src/utils/helper.js
const { v4: uuidv4 } = require('uuid');

function generateHeaders(schemaType) {
    return {
        correlationId: uuidv4().toString(),
        traceId: uuidv4().toString(),
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
