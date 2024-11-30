module.exports = {
    type: "object",
    properties: {
        dashboardId: { type: "string" },
        reportId: { type: "string" },
        content: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
    },
    required: ["dashboardId", "reportId", "content", "timestamp"],
    additionalProperties: false,
}