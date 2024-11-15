/**
 * src\senders\dataCollectResponseSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends a data collection response message to the specified topic.
 * @param {string} taskId - Unique identifier for the data collection task.
 * @param {object} data - The collected data.
 * @returns {Promise<void>}
 */
async function sendDataCollectResponse(taskId, data) {

    if (typeof taskId !== 'string') {
        logger.error('[DataCollectResponseSender] [sendDataCollectResponse] [error] Invalid taskId: Must be a string');
        throw new Error('Invalid taskId: Must be a string');
    }

    if (typeof data !== 'string' && typeof data !== 'object' && !Buffer.isBuffer(data)) {
        logger.error('[DataCollectResponseSender] [sendDataCollectResponse] [error] Invalid data: Must be a string, object, or binary data');
        throw new Error('Invalid data: Must be a string, object, or binary data');
    }

    let dataToSend;

    if (typeof data === 'string') {

        const isHTML = /<\/?[a-z][\s\S]*>/i.test(data);
        const isXML = /<\?xml/.test(data);

        if (isHTML || isXML) {
            dataToSend = data;
        } else {
            dataToSend = JSON.stringify({ text: data });
        }
    } else if (typeof data === 'object') {
        dataToSend = JSON.stringify(data);
    } else if (Buffer.isBuffer(data)) {
        dataToSend = data.toString('base64');
    }

    // parameters
    const key = `dataCollectResponse-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                taskId,
                status: 'completed',
                data: dataToSend,
                message: 'Data collection completed successfully.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dataCollectResponse, pairs);
        logger.info(`[DataCollectResponseSender] [sendDataCollectResponse] [success] Data collect response sent successfully for taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[DataCollectResponseSender] [sendDataCollectResponse] [error] Failed to send data collect response for taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataCollectResponse };
