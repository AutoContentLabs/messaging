module.exports = {
    type: "object",
    properties: {
        jobId: { type: "string" },
        progress: { type: "number", minimum: 0, maximum: 100 },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["jobId", "progress", "timestamp"],
    additionalProperties: false,
}