const { logger, validator, helper } = require("@auto-content-labs/messaging-utils");
const Schemas = require("../schemas")

const { sendMessage } = require("../senders/messageSender");

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
        throw new Error(`No valid data provided for sending. ${this.schemaType}`);
      }

      const validationErrors = validator.validateData(Schemas, this.schemaType, value);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      // Validate headers and ensure type is not changed
      const finalKey = key || helper.generateKey();  // Use the provided key, or generate one if missing
      const finalHeaders = helper.generateHeaders(this.schemaType, headers?.correlationId, headers?.traceId, headers);

      // Construct the pair object to send
      const finalPair = { key: finalKey, value, headers: finalHeaders };

      logger.info(`[Model] Sending model to event... "${this.eventName}".`, finalPair);

      // Send the message to the event
      await sendMessage(this.eventName, finalPair);

      logger.info(`[Model] Successfully sent model to event "${this.eventName}".`);

    } catch (error) {
      logger.error(`[Model] Failed to send model. schema: ${this.schemaType} - ${error.message}`);
      throw error;
    }
  }
}
module.exports = Model;