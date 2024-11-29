/**
 * src/schemas/index.js
 */

const fs = require('fs');
const path = require('path');

const dataCollectRequestSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data_collect_request_schema.json'), 'utf-8')
);

const schemas = {
  DATA_COLLECT_REQUEST: dataCollectRequestSchema,

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
      summary: { type: "object" }
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

  JOB_PROGRESS: {
    type: "object",
    properties: {
      jobId: { type: "string" },
      progress: { type: "number", minimum: 0, maximum: 100 },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["jobId", "progress", "timestamp"],
    additionalProperties: false,
  },

  DATA_PROCESSING_START: {
    type: "object",
    properties: {
      taskId: { type: "string" },
      startTime: { type: "string", format: "date-time" },
    },
    required: ["taskId", "startTime"],
    additionalProperties: false,
  },

  DATA_PROCESSING_STATUS: {
    type: "object",
    properties: {
      taskId: { type: "string" },
      status: { type: "string", enum: ["started", "in_progress", "completed", "failed"] },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["taskId", "status", "timestamp"],
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

  DATA_STORAGE: {
    type: "object",
    properties: {
      storageId: { type: "string" },
      data: { type: "object" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["storageId", "data", "timestamp"],
    additionalProperties: false,
  },

  DATA_AGGREGATION: {
    type: "object",
    properties: {
      aggregationId: { type: "string" },
      aggregatedData: { type: "object" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["aggregationId", "aggregatedData", "timestamp"],
    additionalProperties: false,
  },

  ANALYSIS_REQUEST: {
    type: "object",
    properties: {
      analysisId: { type: "string" },
      requestData: { type: "object" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["analysisId", "requestData", "timestamp"],
    additionalProperties: false,
  },

  ANALYSIS_RESULT: {
    type: "object",
    properties: {
      analysisId: { type: "string" },
      resultData: { type: "object" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["analysisId", "resultData", "timestamp"],
    additionalProperties: false,
  },

  ANALYSIS_ERROR: {
    type: "object",
    properties: {
      analysisId: { type: "string" },
      errorCode: { type: "string" },
      errorMessage: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["analysisId", "errorCode", "errorMessage", "timestamp"],
    additionalProperties: false,
  },

  ALERT: {
    type: "object",
    properties: {
      content: { type: "string" },
      level: { type: "string", enum: ["emerg", "alert", "crit"] },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["content", "level", "timestamp"],
    additionalProperties: false,
  },

  LOG: {
    type: "object",
    properties: {
      logId: { type: "string" },
      message: { type: "string" },
      level: { type: "string", enum: ["debug", "info", "warn", "error", "fatal"] },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["logId", "message", "level", "timestamp"],
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

  DASHBOARD: {
    type: "object",
    properties: {
      dashboardId: { type: "string" },
      reportId: { type: "string" },
      content: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },
    required: ["dashboardId", "reportId", "content", "timestamp"],
    additionalProperties: false,
  },
};

module.exports = schemas;
