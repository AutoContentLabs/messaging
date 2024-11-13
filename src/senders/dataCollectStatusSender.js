// src/senders/dataCollectStatusSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataCollectStatus(taskId, status, messageText) {
    const message = {
        key: `dataCollectStatus-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            status,
            message: messageText
        }))
    };

    sendMessage(topics.dataCollectStatus, [message]);
}

module.exports = { sendDataCollectStatus };
