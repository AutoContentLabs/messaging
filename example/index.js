// example/index.js

const { sendMessage, startListener, onMessage, topics } = require("../src/index");
const { Buffer } = require('buffer');

// EXAMPLES

// dataCollectRequest:
const dataCollectRequest = {
    key: 'dataCollectRequest-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        source: 'google_trends',
        parameters: {
            region: 'US',
            language: 'EN',
            trendCategory: 'Technology'
        },
        status: 'pending',
        message: 'Request to start data collection for trends in Technology category.'
    }))
};

// dataCollectStatus:
const dataCollectStatus = {
    key: 'dataCollectStatus-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        status: 'in-progress', // Can be 'in-progress', 'completed', 'failed'
        message: 'Data collection in progress. Fetching latest trend data from Google Trends.'
    }))
};

// dataCollectResponse:
const dataCollectResponse = {
    key: 'dataCollectResponse-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        status: 'completed',
        data: [
            { trend: 'AI in healthcare', mentions: 15000, region: 'US' },
            { trend: 'Quantum Computing', mentions: 12000, region: 'US' }
        ],
        message: 'Successfully collected trend data.'
    }))
};

// dataCollectError:
const dataCollectError = {
    key: 'dataCollectError-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        errorCode: 'API_TIMEOUT',
        message: 'Error while fetching data from Google Trends API. Timeout occurred.'
    }))
};

// jobScheduleCreate:
const jobScheduleCreate = {
    key: 'jobScheduleCreate-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        jobType: 'dataProcessing',
        schedule: '2024-11-12T09:00:00Z',
        status: 'scheduled',
        message: 'Job scheduled to start processing collected data.'
    }))
};

// jobScheduleUpdate:
const jobScheduleUpdate = {
    key: 'jobScheduleUpdate-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        schedule: '2024-11-12T15:00:00Z',
        status: 'updated',
        message: 'Job schedule updated to start at 3 PM UTC.'
    }))
};

// jobStatus:
const jobStatus = {
    key: 'jobStatus-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        status: 'in-progress', // Can be 'in-progress', 'completed', 'failed'
        message: 'Job is currently processing collected trend data.'
    }))
};

// jobProgress:
const jobProgress = {
    key: 'jobProgress-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        progress: 65, // Progress as percentage
        message: 'Data processing is 65% complete.'
    }))
};

// dataProcessingStart:
const dataProcessingStart = {
    key: 'dataProcessingStart-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        status: 'started',
        message: 'Data processing for trend data has started.'
    }))
};

// dataProcessingStatus:
const dataProcessingStatus = {
    key: 'dataProcessingStatus-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        status: 'in-progress', // Can be 'in-progress', 'completed', 'failed'
        message: 'Data processing is ongoing. Analyzing trend data.'
    }))
};

// dataProcessingResult:
const dataProcessingResult = {
    key: 'dataProcessingResult-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        jobId: 'job-001',
        taskId: 'task-001',
        result: {
            trends: [
                { trend: 'AI in healthcare', score: 85 },
                { trend: 'Quantum Computing', score: 78 }
            ],
            insights: 'AI in healthcare is rapidly growing and attracting significant attention.'
        },
        status: 'completed',
        message: 'Data processing completed. Generated insights for trends.'
    }))
};

// dataStorage:
const dataStorage = {
    key: 'dataStorage-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        data: { trend: 'AI in healthcare', mentions: 15000 },
        status: 'stored',
        message: 'Trend data stored successfully in the database.'
    }))
};

// dataAggregation:
const dataAggregation = {
    key: 'dataAggregation-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        aggregatedData: { 'AI in healthcare': 35000, 'Quantum Computing': 24000 },
        status: 'aggregated',
        message: 'Data aggregation completed for trends.'
    }))
};

// analysisRequest:
const analysisRequest = {
    key: 'analysisRequest-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        analysisType: 'trend_analysis',
        parameters: { region: 'US', category: 'Technology' },
        status: 'pending',
        message: 'Requesting analysis on technology trends.'
    }))
};

// analysisResult:
const analysisResult = {
    key: 'analysisResult-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        analysisType: 'trend_analysis',
        result: { 'AI in healthcare': 85, 'Quantum Computing': 78 },
        status: 'completed',
        message: 'Analysis completed. Trends ranked based on their popularity.'
    }))
};

// analysisError:
const analysisError = {
    key: 'analysisError-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        errorCode: 'API_TIMEOUT',
        message: 'Analysis request failed due to API timeout.'
    }))
};

// alerts:
const alerts = {
    key: 'alerts-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        alertType: 'error',
        taskId: 'task-001',
        message: 'Critical error occurred during data processing.'
    }))
};

// logs:
const logs = {
    key: 'logs-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        logLevel: 'info',
        taskId: 'task-001',
        message: 'Data collection process started successfully.'
    }))
};

// reports:
const reports = {
    key: 'reports-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        reportType: 'summary',
        taskId: 'task-001',
        data: { 'AI in healthcare': 15000, 'Quantum Computing': 12000 },
        status: 'completed',
        message: 'Generated trend summary report.'
    }))
};

// dashboard:
const dashboard = {
    key: 'dashboard-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        stats: { 'AI in healthcare': 15000, 'Quantum Computing': 12000 },
        message: 'Dashboard updated with latest trend statistics.'
    }))
};

// startListener(topics.dataCollectRequest, onMessage);
// startListener(topics.dataCollectStatus, onMessage);
// startListener(topics.dataCollectResponse, onMessage);
// startListener(topics.dataCollectError, onMessage);
// startListener(topics.jobScheduleCreate, onMessage);
// startListener(topics.jobScheduleUpdate, onMessage);
// startListener(topics.jobStatus, onMessage);
// startListener(topics.jobProgress, onMessage);
// startListener(topics.dataProcessingStart, onMessage);
// startListener(topics.dataProcessingStatus, onMessage);
// startListener(topics.dataProcessingResult, onMessage);
// startListener(topics.dataStorage, onMessage);
// startListener(topics.dataAggregation, onMessage);
// startListener(topics.analysisRequest, onMessage);
// startListener(topics.analysisResult, onMessage);
// startListener(topics.analysisError, onMessage);
// startListener(topics.alerts, onMessage);
startListener(topics.logs, onMessage);
// startListener(topics.reports, onMessage);
// startListener(topics.dashboard, onMessage);

// sendMessage(topics.dataCollectRequest, [dataCollectRequest]);
// sendMessage(topics.dataCollectStatus, [dataCollectStatus]);
// sendMessage(topics.dataCollectResponse, [dataCollectResponse]);
// sendMessage(topics.dataCollectError, [dataCollectError]);
// sendMessage(topics.jobScheduleCreate, [jobScheduleCreate]);
// sendMessage(topics.jobScheduleUpdate, [jobScheduleUpdate]);
// sendMessage(topics.jobStatus, [jobStatus]);
// sendMessage(topics.jobProgress, [jobProgress]);
// sendMessage(topics.dataProcessingStart, [dataProcessingStart]);
// sendMessage(topics.dataProcessingStatus, [dataProcessingStatus]);
// sendMessage(topics.dataProcessingResult, [dataProcessingResult]);
// sendMessage(topics.dataStorage, [dataStorage]);
// sendMessage(topics.dataAggregation, [dataAggregation]);
// sendMessage(topics.analysisRequest, [analysisRequest]);
// sendMessage(topics.analysisResult, [analysisResult]);
// sendMessage(topics.analysisError, [analysisError]);
// sendMessage(topics.alerts, [alerts]);
// sendMessage(topics.logs, [logs]);
// sendMessage(topics.reports, [reports]);
// sendMessage(topics.dashboard, [dashboard]);
