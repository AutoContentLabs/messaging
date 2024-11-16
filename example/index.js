// example/index.js
const {
    // topics
    topics, // global topics

    // listener
    // listenMessage, // messageListener.js // global listener

    listenDataCollectRequest, // dataCollectRequestListener.js
    // listenDataCollectStatus,
    // listenDataCollectResponse,
    // listenDataCollectError,

    // listenJobScheduleCreate,
    // listenJobScheduleUpdate,

    // listenJobStatus,
    // listenJobProgress,

    // listenDataProcessingStart,
    // listenDataProcessingStatus,
    // listenDataProcessingResult,

    // listenDataStorage,
    // listenDataAggregation,

    // listenAnalysisRequest,
    // listenAnalysisResult,
    // listenAnalysisError,

    // listenAlert,
    // listenLog,

    // listenReport,
    // listenDashboard,

    // senders
    // sendMessage,// messageSender.js // global sender

    sendDataCollectRequest, // dataCollectRequestSender.js
    // sendDataCollectStatus,
    // sendDataCollectResponse,
    // sendDataCollectError,

    // sendJobScheduleCreate,
    // sendJobScheduleUpdate,

    // sendJobStatus,
    // sendJobProgress,

    // sendDataProcessingStart,
    // sendDataProcessingStatus,
    // sendDataProcessingResult,

    // sendDataStorage,
    // sendDataAggregation,

    // sendAnalysisRequest,
    // sendAnalysisResult,
    // sendAnalysisError,

    // sendAlert,
    // sendLog,

    // sendReport,
    // sendDashboard,

    // handlers
    // handleMessage,// messageHandler.js // global handler

    // handleDataCollectRequest, // dataCollectRequestHandler.js
    // handleDataCollectStatus,
    // handleDataCollectResponse,
    // handleDataCollectError,

    // handleJobScheduleCreate,
    // handleJobScheduleUpdate,

    // handleJobStatus,
    // handleJobProgress,

    // handleDataProcessingStart,
    // handleDataProcessingStatus,
    // handleDataProcessingResult,

    // handleDataStorage,
    // handleDataAggregation,

    // handleAnalysisRequest,
    // handleAnalysisResult,
    // handleAnalysisError,

    // handleAlert,
    // handleLog,

    // handleReport,
    // handleDashboard

    // 
} = require("../src/index")

// listeners example
// listenMessage(topics.dataCollectRequest, handleMessage); // single handler

// listenMessage(topics.dataCollectRequest, handleDataCollectRequest);
// listenMessage(topics.dataCollectStatus, handleDataCollectStatus);
// listenMessage(topics.dataCollectResponse, handleDataCollectResponse);
// listenMessage(topics.dataCollectError, handleDataCollectError);

// listenMessage(topics.jobScheduleCreate, handleJobScheduleCreate);
// listenMessage(topics.jobScheduleUpdate, handleJobScheduleUpdate);

// listenMessage(topics.jobStatus, handleJobStatus);
// listenMessage(topics.jobProgress, handleJobProgress);

// listenMessage(topics.dataProcessingStart, handleDataProcessingStart);
// listenMessage(topics.dataProcessingStatus, handleDataProcessingStatus);
// listenMessage(topics.dataProcessingResult, handleDataProcessingResult);

// listenMessage(topics.dataStorage, handleDataStorage);
// listenMessage(topics.dataAggregation, handleDataAggregation);

// listenMessage(topics.analysisRequest, handleAnalysisRequest);
// listenMessage(topics.analysisResult, handleAnalysisResult);
// listenMessage(topics.analysisError, handleAnalysisError);

// listenMessage(topics.alert, handleAlert);
// listenMessage(topics.log, handleLog);

// listenMessage(topics.report, handleReport);
// listenMessage(topics.dashboard, handleDashboard);


// listen example 2
listenDataCollectRequest()
// listenDataCollectStatus()
// listenDataCollectResponse()
// listenDataCollectError()

// listenJobScheduleCreate()
// listenJobScheduleUpdate()

// listenJobStatus()
// listenJobProgress()

// listenDataProcessingStart()
// listenDataProcessingStatus()
// listenDataProcessingResult()

// listenDataStorage()
// listenDataAggregation()

// listenAnalysisRequest()
// listenAnalysisResult()
// listenAnalysisError()

// listenAlert()
// listenLog()

// listenReport()
// listenDashboard()

// senders example
// sendMessage(topics.dataCollectRequest, []),// messageSender.js // global sender

sendDataCollectRequest("task-0001-01", "Google Trends", { source: "Google Trends", query: "Quantum Computing" });
// sendDataCollectStatus("task-0002-02", "in-progress", "Data collection is running smoothly.");
// sendDataCollectResponse("task-0003-03", { "Quantum Computing": 12345 });
// sendDataCollectError("task-0004-04", "404", "Data source not found");

// sendJobScheduleCreate("job-0001-05", "task-1001", { startTime: "2024-11-14T10:00:00Z", frequency: "daily" });
// sendJobScheduleUpdate("job-0002-06", "task-1002", { startTime: "2024-11-15T10:00:00Z", frequency: "weekly" });

// sendJobStatus("job-0001-07", "task-1001", "completed", "Job has been completed successfully.");
// sendJobProgress("job-0002-08", "task-1002", 45, "Data collection is 45% complete.");

// sendDataProcessingStart("job-0003-09", "task-1003");
// sendDataProcessingStatus("job-0003-10", "task-1004", "in-progress", "Processing data...");
// sendDataProcessingResult("job-0003-11", "task-1005", { trends: [{ trend: 'AI', score: 88 }] });

// sendDataStorage("job-0004-12", "task-1006", { trend: "AI in healthcare", mentions: 15000 });
// sendDataAggregation("job-0004-13", "task-1006", { "AI in healthcare": 35000, "Quantum Computing": 24000 });

// sendAnalysisRequest("task-0001-14", "trendAnalysis", { region: 'US', category: 'Technology' });
// sendAnalysisResult("task-0002-15", "trendAnalysis", { "AI in healthcare": 85, "Quantum Computing": 78 });
// sendAnalysisError("task-0002-16", "timeout", "Data source mistake");

// sendAlert("task-0001-17", "warning", "System resource usage exceeded the threshold");
// sendLog("task-0004-18", "info", "Log message: Data collection started.");

// sendReport("task-0001-18", "trend-report", { "trend": "AI in healthcare", "mentions": 15000 });
// sendDashboard("task-0001-19", { "AI in healthcare": 15000, "Quantum Computing": 12000 });