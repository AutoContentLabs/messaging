// handlers
const { handleMessage } = require("./messageHandler") // global handler

const { handleDataCollectRequest } = require("./dataCollectRequestHandler")
const { handleDataCollectStatus } = require("./dataCollectStatusHandler")
const { handleDataCollectResponse } = require("./dataCollectResponseHandler")
const { handleDataCollectError } = require("./dataCollectErrorHandler")

const { handleJobScheduleCreate } = require("./jobScheduleCreateHandler")
const { handleJobScheduleUpdate } = require("./jobScheduleUpdateHandler")

const { handleJobStatus } = require("./jobStatusHandler")
const { handleJobProgress } = require("./jobProgressHandler")

const { handleDataProcessingStart } = require("./dataProcessingStartHandler")
const { handleDataProcessingStatus } = require("./dataProcessingStatusHandler")
const { handleDataProcessingResult } = require("./dataProcessingResultHandler")

const { handleDataStorage } = require("./dataStorageHandler")
const { handleDataAggregation } = require("./dataAggregationHandler")

const { handleAnalysisRequest } = require("./analysisRequestHandler")
const { handleAnalysisResult } = require("./analysisResultHandler")
const { handleAnalysisError } = require("./analysisErrorHandler")

const { handleAlertRequest } = require("./alertHandler")
const { handleLog } = require("./logHandler")

const { handleReport } = require("./reportHandler")
const { handleDashboard } = require("./dashboardHandler")

module.exports = {
    handleMessage,// messageHandler.js // global handler

    handleDataCollectRequest, // dataCollectRequestHandler.js
    handleDataCollectStatus,
    handleDataCollectResponse,
    handleDataCollectError,

    handleJobScheduleCreate,
    handleJobScheduleUpdate,

    handleJobStatus,
    handleJobProgress,

    handleDataProcessingStart,
    handleDataProcessingStatus,
    handleDataProcessingResult,

    handleDataStorage,
    handleDataAggregation,

    handleAnalysisRequest,
    handleAnalysisResult,
    handleAnalysisError,

    handleAlertRequest,
    handleLog,

    handleReport,
    handleDashboard
};
