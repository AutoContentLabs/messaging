module.exports = {
    type: "object",
    properties: {
        logId: { type: "string" },
        message: { type: "string" },
        level: { type: "string", enum: ["debug", "info", "warn", "error", "fatal"] },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["logId", "message", "level", "timestamp"],
    additionalProperties: false,
}