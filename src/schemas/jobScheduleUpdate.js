module.exports = {
    type: "object",
    properties: {
        jobId: { type: "string" },
        schedule: { type: "string", format: "date-time" },
        updatedBy: { type: "string" },
    },
    required: ["jobId", "schedule"],
    additionalProperties: false,
}