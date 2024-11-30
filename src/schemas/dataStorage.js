module.exports = {
    type: "object",
    properties: {
        storageId: { type: "string" },
        data: { type: "object" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["storageId", "data", "timestamp"],
    additionalProperties: false,
}