module.exports = {
    type: "object",
    properties: {
        taskId: { type: "string" },
        startTime: { type: "string", format: "date-time" },
    },
    required: ["taskId", "startTime"],
    additionalProperties: false,
}