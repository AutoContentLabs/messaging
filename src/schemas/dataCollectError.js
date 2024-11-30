module.exports = {
    type: "object",
    properties: {
        id: { type: "string" },
        errorCode: { type: "string" },
        errorMessage: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "errorCode", "errorMessage", "timestamp"],
    additionalProperties: false,
}