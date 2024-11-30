/**
 * src/schemas/index.js
 */

const dataCollectRequest = require("./dataCollectRequest")
const dataCollectStatus = require("./dataCollectStatus")
const dataCollectResponse = require("./dataCollectResponse")
const dataCollectError = require("./dataCollectError")

const jobScheduleCreate = require("./jobScheduleCreate")
const jobScheduleUpdate = require("./jobScheduleUpdate")
const jobStatus = require("./jobStatus")
const jobProgress = require("./jobProgress")

const dataProcessingStart = require("./dataProcessingStart")
const dataProcessingStatus = require("./dataProcessingStatus")
const dataProcessingResult = require("./dataProcessingResult")

const dataStorage = require("./dataStorage")
const dataAggregation = require("./dataAggregation")

const analysisRequest = require("./analysisRequest")
const analysisResult = require("./analysisResult")
const analysisError = require("./analysisError")

const alert = require("./alert")
const log = require("./log")
const notification = require("./notification")
const metric = require("./metric")

const report = require("./report")
const dashboard = require("./dashboard")

const schemas = {
  DATA_COLLECT_REQUEST: dataCollectRequest,
  DATA_COLLECT_RESPONSE: dataCollectResponse,
  DATA_COLLECT_STATUS: dataCollectStatus,
  DATA_COLLECT_ERROR: dataCollectError,
  JOB_SCHEDULE_CREATE: jobScheduleCreate,
  JOB_SCHEDULE_UPDATE: jobScheduleUpdate,
  JOB_STATUS: jobStatus,
  JOB_PROGRESS: jobProgress,
  DATA_PROCESSING_START: dataProcessingStart,
  DATA_PROCESSING_STATUS: dataProcessingStatus,
  DATA_PROCESSING_RESULT: dataProcessingResult,
  DATA_STORAGE: dataStorage,
  DATA_AGGREGATION: dataAggregation,
  ANALYSIS_REQUEST: analysisRequest,
  ANALYSIS_RESULT: analysisResult,
  ANALYSIS_ERROR: analysisError,
  ALERT: alert,
  LOG: log,
  NOTIFICATION: notification,
  METRIC: metric,
  REPORT: report,
  DASHBOARD: dashboard,
};

module.exports = schemas;
