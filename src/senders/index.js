// senders
const { sendMessage, sendMessages } = require("./messageSender") // messageSender.js // global sender

const { sendDataCollectRequestRequest } = require("./dataCollectRequestSender") // dataCollectRequestSender.js
const { sendDataCollectStatusRequest } = require("./dataCollectStatusSender")
const { sendDataCollectResponseRequest } = require("./dataCollectResponseSender")
const { sendDataCollectErrorRequest } = require("./dataCollectErrorSender")

const { sendJobScheduleCreateRequest } = require("./jobScheduleCreateSender")
const { sendJobScheduleUpdateRequest } = require("./jobScheduleUpdateSender")

const { sendJobStatusRequest } = require("./jobStatusSender")
const { sendJobProgressRequest } = require("./jobProgressSender")

const { sendDataProcessingStartRequest } = require("./dataProcessingStartSender")
const { sendDataProcessingStatusRequest } = require("./dataProcessingStatusSender")
const { sendDataProcessingResultRequest } = require("./dataProcessingResultSender")

const { sendDataStorageRequest } = require("./dataStorageSender")
const { sendDataAggregationRequest } = require("./dataAggregationSender")

const { sendAnalysisRequestRequest } = require("./analysisRequestSender")
const { sendAnalysisResultRequest } = require("./analysisResultSender")
const { sendAnalysisErrorRequest } = require("./analysisErrorSender")

const { sendAlertRequest } = require("./alertSender")
const { sendLogRequest } = require("./logSender")

const { sendReportRequest } = require("./reportSender")
const { sendDashboardRequest } = require("./dashboardSender")

module.exports = {
    // senders
    sendMessage,// messageSender.js // global sender
    sendMessages,
    sendDataCollectRequestRequest, // dataCollectRequestSender.js
    sendDataCollectStatusRequest,
    sendDataCollectResponseRequest,
    sendDataCollectErrorRequest,

    sendJobScheduleCreateRequest,
    sendJobScheduleUpdateRequest,

    sendJobStatusRequest,
    sendJobProgressRequest,

    sendDataProcessingStartRequest,
    sendDataProcessingStatusRequest,
    sendDataProcessingResultRequest,

    sendDataStorageRequest,
    sendDataAggregationRequest,

    sendAnalysisRequestRequest,
    sendAnalysisResultRequest,
    sendAnalysisErrorRequest,

    sendAlertRequest,
    sendLogRequest,

    sendReportRequest,
    sendDashboardRequest,
};
