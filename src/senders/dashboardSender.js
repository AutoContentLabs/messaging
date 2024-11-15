// src/senders/dashboardSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends an update for the dashboard with trend statistics.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} stats - The statistics to update on the dashboard (e.g., { 'AI in healthcare': 15000, 'Quantum Computing': 12000 }).
 * @returns {Promise<void>}
 */
async function sendDashboardUpdate(taskId, stats) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof stats !== 'object') {
        logger.alert(`[DashboardSender] [sendDashboardUpdate] [alert] Invalid arguments for taskId: ${taskId}`);
        throw new Error('Invalid arguments');
    }

    logger.debug(`[DashboardSender] [sendDashboardUpdate] [debug] Starting dashboard update for taskId: ${taskId}`);

    const message = {
        key: `dashboard-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            stats,
            message: 'Dashboard updated with trend statistics.'
        }))
    };

    try {
        await sendMessage(topics.dashboard, [message]);
        logger.info(`[DashboardSender] [sendDashboardUpdate] [info] Dashboard update sent successfully for taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[DashboardSender] [sendDashboardUpdate] [error] Failed to send message for taskId: ${taskId} - ${error.message}`);
        throw error;
    }
}

module.exports = { sendDashboardUpdate };
