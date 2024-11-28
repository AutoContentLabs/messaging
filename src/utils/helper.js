// src/utils/helper.js
const crypto = require('crypto');

function generateId(size) {
    return crypto.randomBytes(size).toString('hex');
}

function generateHeaders(schemaType, correlationId, traceId) {
    const headers =
    {
        correlationId: correlationId || generateId(16),
        traceId: traceId || generateId(16),
        type: `${schemaType}` || "" // no schema
    };
    // temporary assign
    headers.traceId = headers.correlationId
    return headers;
}

function generateKey() {
    return {
        recordId: generateId(8)
    };
}

/**
 * Returns the current timestamp in ISO format.
 * @returns {string} Current timestamp.
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

module.exports = { generateKey, generateHeaders, getCurrentTimestamp, generateId };
