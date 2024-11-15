/**
 * src\senders\alertSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends an alert message related to a task.
 * @param {string} taskId - The task's unique identifier.
 * @param {string} alertType - The type of alert (e.g., "error", "warning").
 * @param {string} messageText - The message describing the alert.
 * @returns {Promise<void>}
 */
async function sendAlert(taskId, alertType, messageText) {
    // check
    if (typeof taskId !== 'string' || typeof alertType !== 'string' || typeof messageText !== 'string') {
        logger.alert(`[AlertSender] [sendAlert] [alert] Invalid arguments for taskId: ${taskId}`);
        throw new Error('Invalid arguments');
    }

    // Debug log
    logger.debug(`[AlertSender] [sendAlert] [debug] Starting sendAlert for taskId: ${taskId} with alertType: ${alertType}`);

    // parameters
    const key = `alert-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                alertType,
                taskId,
                message: messageText
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.alert, pairs);
        logger.info(`[AlertSender] [sendAlert] [info] Alert sent successfully for taskId: ${taskId} with alert type: ${alertType}`);
    } catch (error) {
        logger.error(`[AlertSender] [sendAlert] [error] Failed to send alert for taskId: ${taskId} - ${error.message}`);
        throw error;
    }
}

module.exports = { sendAlert };
