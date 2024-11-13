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
        logger.error('Invalid arguments passed to sendDashboardUpdate');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `dashboard-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            stats, // Example: { 'AI in healthcare': 15000, 'Quantum Computing': 12000 }
            message: 'Dashboard updated with trend statistics.'
        }))
    };

    try {
        // Send the dashboard update message to the dashboard topic
        await sendMessage(topics.dashboard, [message]);
        logger.info(`Dashboard updated successfully for taskId: ${taskId}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`Failed to send dashboard update for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendDashboardUpdate };
