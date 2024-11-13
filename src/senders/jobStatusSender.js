// src/senders/jobStatusSender.js
const { sendMessage, topics } = require('../messageService');

function sendJobStatus(jobId, taskId, status, message) {
    const jobStatusMessage = {
        key: `jobStatus-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            status,
            message
        }))
    };

    sendMessage(topics.jobStatus, [jobStatusMessage]);
}

module.exports = { sendJobStatus };
