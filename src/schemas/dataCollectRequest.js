// src\schemas\dataCollectRequest.js
const service = require("./service")
module.exports = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "description": "Unique identifier for the data collect request."
        },
        "service": service
    },
    "required": ["id", "service"],
    "additionalProperties": false
}
