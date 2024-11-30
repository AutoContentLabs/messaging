module.exports = {
    type: "object",
    properties: {
        taskId: { type: "string" },
        result: { type: "object" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["taskId", "result", "timestamp"],
    additionalProperties: false,
}