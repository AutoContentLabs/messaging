module.exports = {
    type: "object",
    properties: {
        reportId: { type: "string" },
        content: { type: "string" },
        generatedBy: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["reportId", "content", "generatedBy", "timestamp"],
    additionalProperties: false,
}