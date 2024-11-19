const {
    // topics
    topics, // global topics

    // listener functions
    listenDataCollectRequest,
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
    listenDashboard,

    // sender functions
    sendDataCollectRequestRequest,
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

    // handler functions
    handleDataCollectRequestRequest,
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

} = require("../src/index");

// Example listeners
listenDataCollectRequest();
listenDataCollectStatus();
listenDataCollectResponse();
listenDataCollectError();

listenJobScheduleCreate();
listenJobScheduleUpdate();

listenJobStatus();
listenJobProgress();

listenDataProcessingStart();
listenDataProcessingStatus();
listenDataProcessingResult();

listenDataStorage();
listenDataAggregation();

listenAnalysisRequest();
listenAnalysisResult();
listenAnalysisError();

listenAlert();
listenLog();

listenReport();
listenDashboard();

// Example senders
sendDataCollectRequestRequest("task-0001-01", "Google Trends", { source: "Google Trends", query: "Quantum Computing" });
sendDataCollectStatusRequest("task-0002-02", "in-progress", "Data collection is running smoothly.");
sendDataCollectResponseRequest("task-0003-03", { "Quantum Computing": 12345 });
sendDataCollectErrorRequest("task-0004-04", "404", "Data source not found");

sendJobScheduleCreateRequest("job-0001-05", "task-1001", { startTime: "2024-11-14T10:00:00Z", frequency: "daily" });
sendJobScheduleUpdateRequest("job-0002-06", "task-1002", { startTime: "2024-11-15T10:00:00Z", frequency: "weekly" });

sendJobStatusRequest("job-0001-07", "task-1001", "completed", "Job has been completed successfully.");
sendJobProgressRequest("job-0002-08", "task-1002", 45, "Data collection is 45% complete.");

sendDataProcessingStartRequest("job-0003-09", "task-1003");
sendDataProcessingStatusRequest("job-0003-10", "task-1004", "in-progress", "Processing data...");
sendDataProcessingResultRequest("job-0003-11", "task-1005", { trends: [{ trend: 'AI', score: 88 }] });

sendDataStorageRequest("job-0004-12", "task-1006", { trend: "AI in healthcare", mentions: 15000 });
sendDataAggregationRequest("job-0004-13", "task-1006", { "AI in healthcare": 35000, "Quantum Computing": 24000 });

sendAnalysisRequestRequest("task-0001-14", "trendAnalysis", { region: 'US', category: 'Technology' });
sendAnalysisResultRequest("task-0002-15", "trendAnalysis", { "AI in healthcare": 85, "Quantum Computing": 78 });
sendAnalysisErrorRequest("task-0002-16", "timeout", "Data source mistake");

sendAlertRequest("task-0001-17", "warning", "System resource usage exceeded the threshold");
sendLogRequest("task-0004-18", "info", "Log message: Data collection started.");

sendReportRequest("task-0001-18", "trend-report", { "trend": "AI in healthcare", "mentions": 15000 });
sendDashboardRequest("task-0001-19", { "AI in healthcare": 15000, "Quantum Computing": 12000 });
