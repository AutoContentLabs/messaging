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

sendDataCollectRequestRequest(
    {
        "id": "dc12345",
        "source": "Google Trends",
        "params": {
            "keyword": "AI technology",
            "location": "US"
        },
        "priority": "high",
        "timestamp": "2024-11-19T12:30:00Z"
    }
);

// sendDataCollectStatusRequestRequest
sendDataCollectStatusRequest(
    {
        "id": "dc12345",
        "status": "in_progress",
        "message": "Data collection is currently in progress",
        "timestamp": "2024-11-19T12:35:00Z"
    }
);

// sendDataCollectResponseRequest
sendDataCollectResponseRequest(
    {
        "id": "dc12345",
        "data": {
            "keywords": ["AI", "machine learning", "technology"]
        },
        "timestamp": "2024-11-19T12:40:00Z"
    }
);

// sendDataCollectErrorRequest
sendDataCollectErrorRequest(
    {
        "id": "dc12345",
        "errorCode": "error",
        "errorMessage": "Error occurred while collecting data",
        "timestamp": "2024-11-19T12:45:00Z"
    }
);

// sendJobScheduleCreateRequest
sendJobScheduleCreateRequest(
    {
        "jobId": "job12345",
        "schedule": "2024-11-20T10:00:00Z",
        "createdBy": "system",
        "priority": "high",
        "timestamp": "2024-11-19T12:50:00Z"
    }
);

// sendJobScheduleUpdateRequest
sendJobScheduleUpdateRequest(
    {
        "jobId": "job12345",
        "schedule": "2024-11-20T12:00:00Z",
        "updatedBy": "admin",
        "timestamp": "2024-11-19T12:55:00Z"
    }
);

// sendJobStatusRequest
sendJobStatusRequest(
    {
        "jobId": "job12345",
        "status": "in-progress",
        "progress": 50,
        "timestamp": "2024-11-19T13:00:00Z"
    }
);

// sendJobProgressRequest
sendJobProgressRequest(
    {
        "jobId": "job12345",
        "progress": 50,
        "timestamp": "2024-11-19T13:05:00Z"
    }
);

// sendDataProcessingStartRequest
sendDataProcessingStartRequest(
    {
        "taskId": "dp12345",
        "startTime": "2024-11-19T13:10:00Z"
    }
);

// sendDataProcessingStatusRequest
sendDataProcessingStatusRequest(
    {
        "taskId": "dp12345",
        "status": "in_progress",
        "progress": 75,
        "timestamp": "2024-11-19T13:15:00Z"
    }
);

// sendDataProcessingResultRequest
sendDataProcessingResultRequest(
    {
        "taskId": "dp12345",
        "result": {
            "status": "success",
            "message": "Data processed successfully"
        },
        "timestamp": "2024-11-19T13:20:00Z"
    }
);

// sendDataStorageRequest
sendDataStorageRequest(
    {
        "storageId": "storage12345",
        "data": {
            "type": "processed_data",
            "content": "Sample processed data"
        },
        "timestamp": "2024-11-19T13:25:00Z"
    }
);

// sendDataAggregationRequest
sendDataAggregationRequest(
    {
        "aggregationId": "aggregation12345",
        "aggregatedData": {
            "type": "trend_analysis",
            "data": ["AI", "machine learning", "technology"]
        },
        "timestamp": "2024-11-19T13:30:00Z"
    }
);

// sendAnalysisRequestRequest
sendAnalysisRequestRequest(
    {
        "analysisId": "analysis12345",
        "requestData": {
            "type": "trend",
            "dataId": "aggregated_data"
        },
        "timestamp": "2024-11-19T13:35:00Z"
    }
);

// sendAnalysisResultRequest
sendAnalysisResultRequest(
    {
        "analysisId": "analysis12345",
        "resultData": {
            "trend": "positive",
            "message": "Trend analysis completed successfully"
        },
        "timestamp": "2024-11-19T13:40:00Z"
    }
);

// sendAnalysisErrorRequest
sendAnalysisErrorRequest(
    {
        "analysisId": "analysis12345",
        "errorCode": "analysis_error",
        "errorMessage": "Error occurred during analysis",
        "timestamp": "2024-11-19T13:45:00Z"
    }
);

// sendAlertRequest
sendAlertRequest(
    {
        "content": "Data collection has failed, please check logs",
        "level": "alert",
        "timestamp": "2024-11-19T13:50:00Z"
    }
);

// sendLogRequest
sendLogRequest(
    {
        "logId": "log12345",
        "message": "Data collection process initiated",
        "level": "info",
        "timestamp": "2024-11-19T13:55:00Z"
    }
);


// Sending notification:
// {
//   "recipient": "user123",
//   "message": "Your AI technology trend report is ready.",
//   "type": "info",
//   "timestamp": "2024-11-19T14:30:00Z"
// }

// Sending metric:
// {
//   "metricId": "cpu-usage-001",
//   "value": 75.5,
//   "unit": "%",
//   "timestamp": "2024-11-19T14:35:00Z"
// }

// sendReportRequest
sendReportRequest(
    {
        "id": "report12345",
        "title": "Trend Analysis Report",
        "content": "Detailed analysis of the trend for 'AI technology' in US",
        "status": "completed",
        "timestamp": "2024-11-19T14:00:00Z"
    }
);

// sendDashboardRequest
sendDashboardRequest(
    {
        "id": "dashboard12345",
        "data": "trend_analysis_data",
        "status": "updated",
        "timestamp": "2024-11-19T14:05:00Z"
    }
);
