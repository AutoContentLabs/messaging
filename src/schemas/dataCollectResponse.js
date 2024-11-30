// src\schemas\dataCollectResponse.js
const service = require("./service")
const content = require("./content")
const serviceMeasurement = require("./content")

module.exports = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "description": "Unique identifier for the data collect request."
        },
        "service": service,
        "content": content
    },
    "required": ["id", "service", "content"],
    "additionalProperties": false
}
