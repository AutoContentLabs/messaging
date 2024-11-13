// src/senders/analysisResultSender.js
const { sendMessage, topics } = require('../messageService');

function sendAnalysisResult(taskId, analysisType, result) {
    const message = {
        key: `analysisResult-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            analysisType,
            result, // Example: { 'AI in healthcare': 85, 'Quantum Computing': 78 }
            status: 'completed',
            message: 'Analysis completed successfully.'
        }))
    };

    sendMessage(topics.analysisResult, [message]);
}

module.exports = { sendAnalysisResult };
