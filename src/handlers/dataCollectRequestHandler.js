/**
 * src\handlers\dataCollectRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler")

/**
 * Handles incoming messages.
 * 
 * @param {Object} pair - The parameters for the function.
 * @param {JSON} pair.key - The key of the message.
 * @param {JSON} pair.value - The value of the message (the main data payload).
 */
async function handleDataCollectRequest(pair) {
    console.log("datacollec", pair)
    // we must use the base message handler
    const model = handleMessage(pair)

    // Log the message header details
    logger.debug(`[handleDataCollectRequest] [debug] Ready message model`);

    try {

        if (model) {
            try {
                logger.debug(`[handleDataCollectRequest] [debug] message model is valid: ${JSON.stringify(model)}`);
                const { key, value } = model

                logger.notice(`[handleDataCollectRequest] [notice] key: ${key} value: ${value}`)
                // Do something
            } catch (error) {
                logger.warn(`[handleDataCollectRequest] [warn]  message model is no valid. error: ${error.message}, value: ${JSON.stringify(model)}`);
            }
        }

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`[handleDataCollectRequest] [error] Error message model - error: ${error.message}`);
    }
}

module.exports = { handleDataCollectRequest };
