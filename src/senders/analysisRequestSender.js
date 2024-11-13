// src/senders/analysisRequestSender.js
const { sendMessage, topics } = require('../messageService');

function sendAnalysisRequest(taskId, analysisType, parameters) {
    const message = {
        key: `analysisRequest-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            analysisType,
            parameters, // Example: { region: 'US', category: 'Technology' }
            status: 'pending',
            message: 'Requesting analysis for trends.'
        }))
    };

    sendMessage(topics.analysisRequest, [message]);
}

module.exports = { sendAnalysisRequest };
