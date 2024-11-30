module.exports = {
    type: "object",
    properties: {
        taskId: { type: "string" },
        status: { type: "string", enum: ["started", "in_progress", "completed", "failed"] },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["taskId", "status", "timestamp"],
    additionalProperties: false,
}