/**
 * src\senders\dashboardSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends an update for the dashboard with trend statistics.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} stats - The statistics to update on the dashboard (e.g., { 'AI in healthcare': 15000, 'Quantum Computing': 12000 }).
 * @returns {Promise<void>}
 */
async function sendDashboard(taskId, stats) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof stats !== 'object') {
        logger.alert(`[DashboardSender] [sendDashboard] [alert] Invalid arguments for taskId: ${taskId}`);
        throw new Error('Invalid arguments');
    }

    logger.debug(`[DashboardSender] [sendDashboard] [debug] Starting dashboard update for taskId: ${taskId}`);

    // parameters
    const key = `dashboard-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                taskId,
                stats,
                message: 'Dashboard updated with trend statistics.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dashboard, pairs);
        logger.info(`[DashboardSender] [sendDashboard] [info] Dashboard update sent successfully for taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[DashboardSender] [sendDashboard] [error] Failed to send message for taskId: ${taskId} - ${error.message}`);
        throw error;
    }
}

module.exports = { sendDashboard };
