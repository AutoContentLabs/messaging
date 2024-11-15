/**
 * src\handlers\dataCollectRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler")

/**
 * Handles incoming messages.
 * 
 * @param {Object} dataPackage - The parameters for the function.
 * @param {string} dataPackage.topic - The topic from which the message was received.
 * @param {Object} dataPackage.pair - The message object containing key, value, timestamp, and offset.
 * @param {Buffer} dataPackage.pair.key - The key of the message.
 * @param {Buffer} dataPackage.pair.value - The value of the message (the main data payload).
 * @param {string} dataPackage.pair.timestamp - The timestamp of the message.
 * @param {string} dataPackage.pair.offset - The offset of the message in the partition.
 * @param {number} dataPackage.partition - The partition number from which the message was received.
 */
async function handleDataCollectRequest({ topic, pair, partition } = dataPackage) {

    // we must use the base message handler
    const model = handleMessage(dataPackage)

    // Log the message header details
    logger.debug(`[handleDataCollectRequest] [debug] Ready message model`);

    try {

        if (model) {
            try {
                logger.debug(`[handleDataCollectRequest] [debug] message model is valid: ${JSON.stringify(model)}`);
                const { timestamp } = model
                const { key } = pair
                logger.notice(`[handleDataCollectRequest] [notice] key: ${key}, timestamp: ${timestamp}`)
                // Do something
            } catch (error) {
                logger.warn(`[handleDataCollectRequest] [warn]  message model is no valid. error: ${error.message}, value: ${JSON.stringify(model)}`);
            }
        }

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`[handleDataCollectRequest] [error] Error message model - topic: ${topic}, partition: ${partition}, error: ${error.message}`);
    }
}

module.exports = { handleDataCollectRequest };
