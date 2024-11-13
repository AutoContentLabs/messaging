// src/senders/dataCollectRequestSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataCollectRequest(taskId, source, parameters) {
    const message = {
        key: `dataCollectRequest-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            source,
            parameters,
            status: 'pending',
            message: 'Request to start data collection.'
        }))
    };

    sendMessage(topics.dataCollectRequest, [message]);
}

module.exports = { sendDataCollectRequest };
