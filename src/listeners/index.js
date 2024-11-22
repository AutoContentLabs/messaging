/**
 * Messaging System
 */

require('events').EventEmitter.defaultMaxListeners = 30; // MaxListenersExceededWarning

// listener
const { listenMessage } = require("./messageListener") // messageListener.js // global listener

const { listenDataCollectRequest } = require("./dataCollectRequestListener") // dataCollectRequestListener.js
const { listenDataCollectStatus } = require("./dataCollectStatusListener")
const { listenDataCollectResponse } = require("./dataCollectResponseListener")
const { listenDataCollectError } = require("./dataCollectErrorListener")

const { listenJobScheduleCreate } = require("./jobScheduleCreateListener")
const { listenJobScheduleUpdate } = require("./jobScheduleUpdateListener")

const { listenJobStatus } = require("./jobStatusListener")
const { listenJobProgress } = require("./jobProgressListener")

const { listenDataProcessingStart } = require("./dataProcessingStartListener")
const { listenDataProcessingStatus } = require("./dataProcessingStatusListener")
const { listenDataProcessingResult } = require("./dataProcessingResultListener")

const { listenDataStorage } = require("./dataStorageListener")
const { listenDataAggregation } = require("./dataAggregationListener")

const { listenAnalysisRequest } = require("./analysisRequestListener")
const { listenAnalysisResult } = require("./analysisResultListener")
const { listenAnalysisError } = require("./analysisErrorListener")

const { listenAlert } = require("./alertListener")
const { listenLog } = require("./logListener")

const { listenReport } = require("./reportListener")
const { listenDashboard } = require("./dashboardListener")
module.exports = {
    // listener
    listenMessage, // messageListener.js // global listener

    listenDataCollectRequest, // dataCollectRequestListener.js
    listenDataCollectStatus,
    listenDataCollectResponse,
    listenDataCollectError,

    listenJobScheduleCreate,
    listenJobScheduleUpdate,

    listenJobStatus,
    listenJobProgress,

    listenDataProcessingStart,
    listenDataProcessingStatus,
    listenDataProcessingResult,

    listenDataStorage,
    listenDataAggregation,

    listenAnalysisRequest,
    listenAnalysisResult,
    listenAnalysisError,

    listenAlert,
    listenLog,

    listenReport,
    listenDashboard    
}