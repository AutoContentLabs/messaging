// src/senders/alertSender.js
const { sendMessage, topics } = require('../messageService');

function sendAlert(taskId, alertType, messageText) {
    const message = {
        key: `alert-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            alertType,
            taskId,
            message: messageText
        }))
    };

    sendMessage(topics.alerts, [message]);
}

module.exports = { sendAlert };
