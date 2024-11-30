module.exports = {
    type: "object",
    properties: {
        aggregationId: { type: "string" },
        aggregatedData: { type: "object" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["aggregationId", "aggregatedData", "timestamp"],
    additionalProperties: false,
}