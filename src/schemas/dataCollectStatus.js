module.exports = {
    type: "object",
    properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["pending", "in_progress", "completed", "failed"] },
        message: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "status", "timestamp"],
    additionalProperties: false,
}