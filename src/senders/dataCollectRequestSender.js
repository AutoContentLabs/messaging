/**
 * src\senders\dataCollectRequestSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends a data collection request message to the specified topic.
 * @param {string} taskId - Unique identifier for the data collection task.
 * @param {string} source - Data source (e.g., API name or data origin).
 * @param {object} parameters - Parameters required for data collection (e.g., filters).
 * @returns {Promise<void>}
 */
async function sendDataCollectRequest(taskId, source, parameters) {
    if (typeof taskId !== 'string' || typeof source !== 'string' || typeof parameters !== 'object') {
        logger.crit(`[DataCollectRequestSender] [sendDataCollectRequest] [crit] Invalid arguments passed for taskId: ${taskId}, source: ${source}`);
        throw new Error('Invalid arguments');
    }

    logger.debug(`[DataCollectRequestSender] [sendDataCollectRequest] [debug] Starting to send data collection request for taskId: ${taskId}, source: ${source}`);

    // parameters
    const key = `dataCollectRequest-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                taskId,
                source,
                parameters,
                status: 'pending',
                message: 'Request to start data collection.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];
    
    try {
        await sendMessage(topics.dataCollectRequest, pairs);
        logger.info(`[DataCollectRequestSender] [sendDataCollectRequest] [info] Data collect request sent successfully for taskId: ${taskId}, source: ${source}`);
    } catch (error) {
        logger.error(`[DataCollectRequestSender] [sendDataCollectRequest] [error] Failed to send data collect request for taskId: ${taskId}, source: ${source}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataCollectRequest };
