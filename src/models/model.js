/**
 * Model
 * src/models/Model.js
 */
const { sendModel } = require("./ModelSender");
const logger = require("../utils/logger");

/**
 * Represents a messaging model for data exchange.
 */
class Model {
    /**
     * @param {string} schema - Schema type for the model.
     * @param {string} eventName - Event name or topic name for publishing.
     */
    constructor(schema, eventName) {
        this.schema = schema;
        this.eventName = eventName;
    }

    /**
     * Sends data to the specified topic.
     * @param {Object} model - The model to send.
     * @throws Will throw an error if the model is invalid.
     */
    async send(model) {
        if (!model) {
            throw new Error("No data provided for sending.");
        }

        const key = { id: model.id || Math.random().toString(36).substring(7) };
        logger.debug(`[Model] Sending model... ${this.schema}`, { key, model });
        await sendModel(this.schema, this.eventName, { key, value: model });
    }
}

module.exports = Model;
