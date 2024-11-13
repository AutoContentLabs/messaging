// src/senders/logSender.js
const { sendMessage, topics } = require('../messageService');

function sendLog(taskId, logLevel, messageText) {
    const message = {
        key: `log-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            logLevel,
            taskId,
            message: messageText
        }))
    };

    sendMessage(topics.logs, [message]);
}

module.exports = { sendLog };
