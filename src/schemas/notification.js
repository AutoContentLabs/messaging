module.exports = {
    type: "object",
    properties: {
        recipient: { type: "string" },
        message: { type: "string" },
        type: { type: "string", enum: ["info", "warning", "alert"] },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["recipient", "message", "type", "timestamp"],
    additionalProperties: false,
}