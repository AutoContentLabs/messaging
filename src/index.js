// src/index.js
const { sendMessage, startListener, topics } = require("./messageService");
const { onMessage } = require("./messageHandler");
const { sendAlert } = require("./senders/alertSender");
const { sendAnalysisRequest } = require("./senders/analysisRequestSender");
const { sendAnalysisResult } = require("./senders/analysisResultSender");
const { sendDashboardUpdate } = require("./senders/dashboardSender");
const { sendDataAggregation } = require("./senders/dataAggregationSender");
const { sendDataCollectError } = require("./senders/dataCollectErrorSender");
const { sendDataCollectRequest, } = require("./senders/dataCollectRequestSender");
const { sendDataCollectResponse, } = require("./senders/dataCollectResponseSender");
const { sendDataCollectStatus } = require("./senders/dataCollectStatusSender");
const { sendDataProcessingStart, sendDataProcessingStatus, sendDataProcessingResult, } = require("./senders/dataProcessingSender");
const { sendDataStorage } = require("./senders/dataStorageSender");
const { sendJobProgress } = require("./senders/jobProgressSender");
const { sendJobScheduleCreate, sendJobScheduleUpdate, } = require("./senders/jobScheduleSender");
const { sendJobStatus } = require("./senders/jobStatusSender");
const { sendLog } = require("./senders/logSender");
const { sendReport } = require("./senders/reportSender");

module.exports = {
    sendMessage,
    startListener,
    onMessage,
    topics,
    sendAlert,
    sendAnalysisRequest,
    sendAnalysisResult,
    sendDashboardUpdate,
    sendDataAggregation,
    sendDataCollectError,
    sendDataCollectRequest,
    sendDataCollectResponse,
    sendDataCollectStatus,
    sendDataProcessingResult,
    sendDataProcessingStart, sendDataProcessingStatus, sendDataProcessingResult,
    sendDataStorage,
    sendJobProgress,
    sendJobScheduleCreate, sendJobScheduleUpdate,
    sendJobStatus,
    sendLog,
    sendReport
};
