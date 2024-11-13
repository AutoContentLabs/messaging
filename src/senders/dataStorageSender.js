// src/senders/dataStorageSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataStorage(jobId, taskId, data) {
    const message = {
        key: `dataStorage-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            data, // Example: { trend: 'AI in healthcare', mentions: 15000 }
            status: 'stored',
            message: 'Data stored successfully.'
        }))
    };

    sendMessage(topics.dataStorage, [message]);
}

module.exports = { sendDataStorage };
