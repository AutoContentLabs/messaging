module.exports = {
    type: "object",
    properties: {
        jobId: { type: "string" },
        status: { type: "string", enum: ["pending", "running", "completed", "failed"] },
        progress: { type: "number", minimum: 0, maximum: 100 },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["jobId", "status", "timestamp"],
    additionalProperties: false,
}