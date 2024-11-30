module.exports = {
    type: "object",
    properties: {
        metricId: { type: "string" },
        value: { type: "number" },
        unit: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["metricId", "value", "unit", "timestamp"],
    additionalProperties: false,
}