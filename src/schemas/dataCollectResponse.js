const service = require("./service")
const content = require("./content")
const measurement = require("./measurement")
module.exports = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "description": "Unique identifier for the data collect request."
        },
        "service": service,
        "content": content,
        "measurement": measurement
    },
    "required": ["id", "service", "content", "measurement"],
    "additionalProperties": false
}
