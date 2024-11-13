const alertSender = require("./alertSender");
const analysisRequestSender = require("./analysisRequestSender");
const analysisResultSender = require("./analysisResultSender");
const dashboardSender = require("./dashboardSender");
const dataAggregationSender = require("./dataAggregationSender");
const dataCollectErrorSender = require("./dataCollectErrorSender");
const dataCollectRequestSender = require("./dataCollectRequestSender");
const dataCollectResponseSender = require("./dataCollectResponseSender");
const dataCollectStatusSender = require("./dataCollectStatusSender");
const dataProcessingSender = require("./dataProcessingSender");
const dataStorageSender = require("./dataStorageSender");
const jobProgressSender = require("./jobProgressSender");
const jobScheduleSender = require("./jobScheduleSender");
const jobStatusSender = require("./jobStatusSender");
const logSender = require("./logSender");
const reportSender = require("./reportSender");

module.exports = {
    alertSender,
    analysisRequestSender,
    analysisResultSender,
    dashboardSender,
    dataAggregationSender,
    dataCollectErrorSender,
    dataCollectRequestSender,
    dataCollectResponseSender,
    dataCollectStatusSender,
    dataProcessingSender,
    dataStorageSender,
    jobProgressSender,
    jobScheduleSender,
    jobStatusSender,
    logSender,
    reportSender,
};
