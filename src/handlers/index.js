// handlers
const { handleMessage } = require("./messageHandler") // global handler

const { handleDataCollectRequestRequest } = require("./dataCollectRequestHandler")
const { handleDataCollectStatusRequest } = require("./dataCollectStatusHandler")
const { handleDataCollectResponseRequest } = require("./dataCollectResponseHandler")
const { handleDataCollectErrorRequest } = require("./dataCollectErrorHandler")

const { handleJobScheduleCreateRequest } = require("./jobScheduleCreateHandler")
const { handleJobScheduleUpdateRequest } = require("./jobScheduleUpdateHandler")

const { handleJobStatusRequest } = require("./jobStatusHandler")
const { handleJobProgressRequest } = require("./jobProgressHandler")

const { handleDataProcessingStartRequest } = require("./dataProcessingStartHandler")
const { handleDataProcessingStatusRequest } = require("./dataProcessingStatusHandler")
const { handleDataProcessingResultRequest } = require("./dataProcessingResultHandler")

const { handleDataStorageRequest } = require("./dataStorageHandler")
const { handleDataAggregationRequest } = require("./dataAggregationHandler")

const { handleAnalysisRequestRequest } = require("./analysisRequestHandler")
const { handleAnalysisResultRequest } = require("./analysisResultHandler")
const { handleAnalysisErrorRequest } = require("./analysisErrorHandler")

const { handleAlertRequest } = require("./alertHandler")
const { handleLogRequest } = require("./logHandler")

const { handleReportRequest } = require("./reportHandler")
const { handleDashboardRequest } = require("./dashboardHandler")

module.exports = {
    handleMessage,// messageHandler.js // global handler

    handleDataCollectRequestRequest, // dataCollectRequestHandler.js
    handleDataCollectStatusRequest,
    handleDataCollectResponseRequest,
    handleDataCollectErrorRequest,

    handleJobScheduleCreateRequest,
    handleJobScheduleUpdateRequest,

    handleJobStatusRequest,
    handleJobProgressRequest,

    handleDataProcessingStartRequest,
    handleDataProcessingStatusRequest,
    handleDataProcessingResultRequest,

    handleDataStorageRequest,
    handleDataAggregationRequest,

    handleAnalysisRequestRequest,
    handleAnalysisResultRequest,
    handleAnalysisErrorRequest,

    handleAlertRequest,
    handleLogRequest,

    handleReportRequest,
    handleDashboardRequest
};
