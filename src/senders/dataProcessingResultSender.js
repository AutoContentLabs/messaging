// src/senders/dataProcessingResultSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataProcessingResult(jobId, taskId, result) {
    const message = {
        key: `dataProcessingResult-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            result,
            status: 'completed',
            message: 'Data processing completed. Insights generated.'
        }))
    };

    sendMessage(topics.dataProcessingResult, [message]);
}

module.exports = { sendDataProcessingResult };
