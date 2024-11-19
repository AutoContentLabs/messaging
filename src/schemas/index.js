/**
 * src\schemas\index.js
 */
const schemas = {
  DATA_COLLECT_REQUEST: {
    type: "object",
    properties: {
      id: { type: "string" },
      source: { type: "string" },
      params: { type: "object" },
      priority: { type: "string", enum: ["low", "medium", "high"], default: "medium" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "source"],
    additionalProperties: false,
  },
  DATA_COLLECT_STATUS: {
    type: "object",
    properties: {
      id: { type: "string" },
      status: { type: "string", enum: ["pending", "in_progress", "completed", "failed"] },
      message: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "status", "timestamp"],
    additionalProperties: false,
  },
  DATA_COLLECT_RESPONSE: {
    type: "object",
    properties: {
      id: { type: "string" },
      data: { type: "object" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "data", "timestamp"],
    additionalProperties: false,
  },
  DATA_COLLECT_ERROR: {
    type: "object",
    properties: {
      id: { type: "string" },
      errorCode: { type: "string" },
      errorMessage: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["id", "errorCode", "errorMessage", "timestamp"],
    additionalProperties: false,
  },
  JOB_SCHEDULE_CREATE: {
    type: "object",
    properties: {
      jobId: { type: "string" },
      schedule: { type: "string", format: "date-time" },
      createdBy: { type: "string" },
      priority: { type: "string", enum: ["low", "medium", "high"], default: "medium" },
    },
    required: ["jobId", "schedule"],
    additionalProperties: false,
  },
  JOB_SCHEDULE_UPDATE: {
    type: "object",
    properties: {
      jobId: { type: "string" },
      schedule: { type: "string", format: "date-time" },
      updatedBy: { type: "string" },
    },
    required: ["jobId", "schedule"],
    additionalProperties: false,
  },
  JOB_STATUS: {
    type: "object",
    properties: {
      jobId: { type: "string" },
      status: { type: "string", enum: ["pending", "running", "completed", "failed"] },
      progress: { type: "number", minimum: 0, maximum: 100 },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["jobId", "status", "timestamp"],
    additionalProperties: false,
  },
  ALERT: {
    type: "object",
    properties: {
      content: { type: "string" },
      level: { type: "string", enum: ["emerg", "alert", "crit", "error", "warning", "notice", "info", "debug"] },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["content", "level", "timestamp"],
    additionalProperties: false,
  },
  DATA_PROCESSING_RESULT: {
    type: "object",
    properties: {
      taskId: { type: "string" },
      result: { type: "object" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["taskId", "result", "timestamp"],
    additionalProperties: false,
  },
  METRIC: {
    type: "object",
    properties: {
      metricId: { type: "string" },
      value: { type: "number" },
      unit: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["metricId", "value", "unit", "timestamp"],
    additionalProperties: false,
  },
  NOTIFICATION: {
    type: "object",
    properties: {
      recipient: { type: "string" },
      message: { type: "string" },
      type: { type: "string", enum: ["info", "warning", "alert"] },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["recipient", "message", "type", "timestamp"],
    additionalProperties: false,
  },
  REPORT: {
    type: "object",
    properties: {
      reportId: { type: "string" },
      content: { type: "string" },
      generatedBy: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["reportId", "content", "generatedBy", "timestamp"],
    additionalProperties: false,
  },
};
module.exports = schemas  