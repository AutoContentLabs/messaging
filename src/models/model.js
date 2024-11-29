const logger = require("../utils/logger");
const { validateData } = require("../utils/validator");
const { sendMessage } = require("../senders/messageSender");
const { generateHeaders, generateKey } = require("../utils/helper");

class Model {
  constructor(schemaType, eventName) {
    this.schemaType = schemaType;
    this.eventName = eventName;
    logger.debug(`[Model] created schemaType: ${schemaType} eventName ${eventName}`, { schemaType, eventName });
  }

  /**
   * Sends the provided pair object to the event, after validation and processing.
   * @param {Object} pair - The pair object containing key, value (model), and headers.
   * @throws Will throw an error if sending fails or validation fails.
   */
  async send(pair) {

    logger.debug(`[Model] [send] Raw ${JSON.stringify(pair)}`);

    try {
      const { key, value, headers } = pair;

      // Validate the model
      if (!value || typeof value !== "object") {
        throw new Error("No valid data provided for sending.");
      }

      const validationErrors = validateData(this.schemaType, value);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      const finalKey = key || generateKey();  // Use the provided key, or generate one if missing
      const finalHeaders = headers || generateHeaders(this.schemaType);

      // Construct the pair object to send
      const finalPair = { key: finalKey, value, headers: finalHeaders };

      logger.info(`[Model] Sending model to event... "${this.eventName}".`, finalPair);

      // Send the message to the event
      await sendMessage(this.eventName, finalPair);

      logger.info(`[Model] Successfully sent model to event "${this.eventName}".`);

    } catch (error) {
      logger.error(`[Model] Failed to send model: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Model;
