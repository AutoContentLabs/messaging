// src/senders/dataProcessingSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataProcessingStart(jobId, taskId) {
    const startMessage = {
        key: `dataProcessingStart-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            status: 'started',
            message: 'Data processing started for trend data.'
        }))
    };

    sendMessage(topics.dataProcessingStart, [startMessage]);
}
function sendDataProcessingStatus(jobId, taskId, status, statusMessage) {
    const statusMessageData = {
        key: `dataProcessingStatus-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            status,
            message: statusMessage
        }))
    };

    sendMessage(topics.dataProcessingStatus, [statusMessageData]);
}
function sendDataProcessingResult(jobId, taskId, result) {
    const resultMessage = {
        key: `dataProcessingResult-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            result, // Example result: { trends: [{ trend: 'AI', score: 85 }] }
            status: 'completed',
            message: 'Data processing completed.'
        }))
    };

    sendMessage(topics.dataProcessingResult, [resultMessage]);
}

module.exports = { sendDataProcessingStart, sendDataProcessingStatus, sendDataProcessingResult };