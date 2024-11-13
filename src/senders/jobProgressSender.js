// src/senders/jobProgressSender.js
const { sendMessage, topics } = require('../messageService');

function sendJobProgress(jobId, taskId, progress, message) {
    const jobProgressMessage = {
        key: `jobProgress-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            progress, // e.g., 65 for 65%
            message
        }))
    };

    sendMessage(topics.jobProgress, [jobProgressMessage]);
}

module.exports = { sendJobProgress };
