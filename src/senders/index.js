// senders
const { sendMessage } = require("./messageSender") // messageSender.js // global sender

const { sendDataCollectRequest } = require("./dataCollectRequestSender") // dataCollectRequestSender.js
const { sendDataCollectStatus } = require("./dataCollectStatusSender")
const { sendDataCollectResponse } = require("./dataCollectResponseSender")
const { sendDataCollectError } = require("./dataCollectErrorSender")

const { sendJobScheduleCreate } = require("./jobScheduleCreateSender")
const { sendJobScheduleUpdate } = require("./jobScheduleUpdateSender")

const { sendJobStatus } = require("./jobStatusSender")
const { sendJobProgress } = require("./jobProgressSender")

const { sendDataProcessingStart } = require("./dataProcessingStartSender")
const { sendDataProcessingStatus } = require("./dataProcessingStatusSender")
const { sendDataProcessingResult } = require("./dataProcessingResultSender")

const { sendDataStorage } = require("./dataStorageSender")
const { sendDataAggregation } = require("./dataAggregationSender")

const { sendAnalysisRequest } = require("./analysisRequestSender")
const { sendAnalysisResult } = require("./analysisResultSender")
const { sendAnalysisError } = require("./analysisErrorSender")

const { sendAlert } = require("./alertSender")
const { sendLog } = require("./logSender")

const { sendReport } = require("./reportSender")
const { sendDashboard } = require("./dashboardSender")

module.exports = {
    // senders
    sendMessage,// messageSender.js // global sender

    sendDataCollectRequest, // dataCollectRequestSender.js
    sendDataCollectStatus,
    sendDataCollectResponse,
    sendDataCollectError,

    sendJobScheduleCreate,
    sendJobScheduleUpdate,

    sendJobStatus,
    sendJobProgress,

    sendDataProcessingStart,
    sendDataProcessingStatus,
    sendDataProcessingResult,

    sendDataStorage,
    sendDataAggregation,

    sendAnalysisRequest,
    sendAnalysisResult,
    sendAnalysisError,

    sendAlert,
    sendLog,

    sendReport,
    sendDashboard,
};
