module.exports = {
    type: "object",
    properties: {
        analysisId: { type: "string" },
        errorCode: { type: "string" },
        errorMessage: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["analysisId", "errorCode", "errorMessage", "timestamp"],
    additionalProperties: false,
}