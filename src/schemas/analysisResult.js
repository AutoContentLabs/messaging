module.exports = {
    type: "object",
    properties: {
        analysisId: { type: "string" },
        resultData: { type: "object" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["analysisId", "resultData", "timestamp"],
    additionalProperties: false,
}