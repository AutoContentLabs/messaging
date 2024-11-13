// src/senders/alertSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends an alert message related to a task.
 * @param {string} taskId - The task's unique identifier.
 * @param {string} alertType - The type of alert (e.g., "error", "warning").
 * @param {string} messageText - The message describing the alert.
 * @returns {Promise<void>}
 */
async function sendAlert(taskId, alertType, messageText) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof alertType !== 'string' || typeof messageText !== 'string') {
        logger.error('Invalid arguments passed to sendAlert');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `alert-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            alertType,
            taskId,
            message: messageText
        }))
    };

    try {
        // Send the alert message to the alerts topic
        await sendMessage(topics.alerts, [message]);
        logger.info(`Alert message sent for taskId: ${taskId} with alert type: ${alertType}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`Failed to send alert message for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendAlert };
