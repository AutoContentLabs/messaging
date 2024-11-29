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
    const { key, value, headers } = pair;
    const { correlationId, traceId } = headers;

    logger.debug(`[Model] [send] Raw ${JSON.stringify(value)}`);

    try {
      // Validate the model
      if (!value || typeof value !== "object") {
        throw new Error("No valid data provided for sending.");
      }

      const validationErrors = validateData(this.schemaType, value);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      // Use the provided key or generate a new one if not present
      const finalKey = key || generateKey();  // Use the provided key, or generate one if missing

      // Generate headers (you can dynamically modify headers here if needed)
      const eventHeaders = generateHeaders(this.schemaType, correlationId, traceId);

      logger.info(`[Model] Sending model to event "${this.eventName}".`, { finalKey, value });

      // Construct the pair object to send
      const pairToSend = { key: finalKey, value, headers: eventHeaders };

      // Send the message to the event
      await sendMessage(this.eventName, pairToSend);

      logger.info(`[Model] Successfully sent model to event "${this.eventName}".`);

    } catch (error) {
      logger.error(`[Model] Failed to send model: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Model;
