// src/senders/dataCollectResponseSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataCollectResponse(taskId, data) {
    const message = {
        key: `dataCollectResponse-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            status: 'completed',
            data,
            message: 'Data collection completed successfully.'
        }))
    };

    sendMessage(topics.dataCollectResponse, [message]);
}

module.exports = { sendDataCollectResponse };
