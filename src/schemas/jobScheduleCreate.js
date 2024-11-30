module.exports = {
    type: "object",
    properties: {
        jobId: { type: "string" },
        schedule: { type: "string", format: "date-time" },
        createdBy: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high"], default: "medium" },
    },
    required: ["jobId", "schedule"],
    additionalProperties: false,
}