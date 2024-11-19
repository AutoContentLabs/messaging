/**
 * Model
 * src/models/Model.js
 */

const logger = require("../utils/logger");
const { validateData } = require("../utils/validator");
const { sendMessage } = require("../senders/MessageSender");
const { generateHeaders, generateKey } = require("../utils/helper");

class Model {
  constructor(schemaType, eventName) {
    this.schemaType = schemaType;
    this.eventName = eventName;
    logger.debug(`[Model] created schemaType: ${schemaType} eventName ${eventName}`, { schemaType: schemaType, eventName: eventName })
  }

  async send(model) {
    logger.debug(`[Model] [send] Raw ${JSON.stringify(model)}`)
    try {
      if (!model || typeof model !== "object") {
        throw new Error("No valid data provided for sending.");
      }

      const validationErrors = validateData(this.schemaType, model);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      const key = generateKey()

      const headers = generateHeaders(this.schemaType);

      logger.info(`[Model] Sending model to event "${this.eventName}".`, { key, model });

      const pair = { key, value: model, headers }

      await sendMessage(this.eventName, pair);

      logger.info(`[Model] Successfully sent model to event "${this.eventName}".`);
    } catch (error) {
      logger.error(`[Model] Failed to send model: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Model;