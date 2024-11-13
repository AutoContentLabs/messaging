// src/senders/dataCollectErrorSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataCollectError(taskId, errorCode, errorMessage) {
    const message = {
        key: `dataCollectError-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            errorCode,
            message: errorMessage
        }))
    };

    sendMessage(topics.dataCollectError, [message]);
}

module.exports = { sendDataCollectError };
