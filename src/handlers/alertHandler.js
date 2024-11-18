/**
 * src\handlers\alertHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler")

/**
 * Handles incoming model.
 * 
 * @param {JSON} model - The parameters for the function.
 * @param {STRING} content - 
 * @param {ENUM} level - 
 */
async function handleAlert(model) {

    // we must use the base message handler
    const data = await handleMessage(model)

    // Log the message header details
    logger.debug(`[handleAlert] [debug] Ready message model`);

    try {

        if (model) {
            try {
                logger.debug(`[handleAlert] [debug] message model is valid: ${JSON.stringify(data)}`);
                const { id, timestamp, content, level } = data
                logger.debug(`[handleAlert] [notice] id: ${id} timestamp: ${timestamp} level: ${level} content: ${content}`)
                // Do something
            } catch (error) {
                logger.warn(`[handleAlert] [warn]  data model is no valid. error: ${error.message}, value: ${JSON.stringify(data)}`);
            }
        }

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`[handleAlert] [error] Error data model - error: ${error.message}`);
    }
}

module.exports = { handleAlert };
