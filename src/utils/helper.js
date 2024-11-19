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
    return  {
        recordId: uuidv4().toString()
      };
}

module.exports = { generateKey,generateHeaders };
