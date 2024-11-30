// src\schemas\measurementService.js

const metric = require("./metric")

module.exports =
{
    "type": "object",
    "properties": {
        "service_id": {
            "type": "integer",
            "description": "which service is measurement."
        },
        ...metric.properties
    },
    "required": ["service_id"],
    "additionalProperties": false
}
