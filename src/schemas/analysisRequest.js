module.exports = {
    type: "object",
    properties: {
        analysisId: { type: "string" },
        requestData: { type: "object" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["analysisId", "requestData", "timestamp"],
    additionalProperties: false,
}