module.exports = {
    type: "object",
    properties: {
        content: { type: "string" },
        level: { type: "string", enum: ["emerg", "alert", "crit"] },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["content", "level", "timestamp"],
    additionalProperties: false,
};
