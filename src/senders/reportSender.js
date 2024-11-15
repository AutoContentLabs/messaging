// src/senders/reportSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a generated report message to the reports topic.
 * @param {string} taskId - The task's unique identifier.
 * @param {string} reportType - The type of the report (e.g., 'trend analysis', 'user engagement').
 * @param {object} data - The data contained in the report.
 * @returns {Promise<void>}
 */
async function sendReport(taskId, reportType, data) {
    // Validate reportType
    const validReportTypes = ['trend-report', 'user-engagement', 'content-performance']; // Example types
    if (!validReportTypes.includes(reportType)) {
        logger.error(`[ReportSender] [sendReport] [error] Invalid report type: ${reportType} for taskId: ${taskId}`);
        throw new Error(`Invalid report type: ${reportType}`);
    }

    // Prepare the report message
    const message = {
        key: `report-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            reportType,
            taskId,
            data, // The data related to the report
            status: 'completed',
            message: 'Report generated and sent.'
        }))
    };

    try {
        // Send the message to Kafka topic
        await sendMessage(topics.reports, [message]);
        logger.info(`[ReportSender] [sendReport] [success] Report sent for taskId: ${taskId} with report type: ${reportType}`);
    } catch (error) {
        logger.error(`[ReportSender] [sendReport] [error] Failed to send report for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw error to handle it upstream if needed
    }
}

module.exports = { sendReport };
