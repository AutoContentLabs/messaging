/**
 * Alert sender
 * src/senders/AlertSender.js
 */
const { topics } = require("../topics");
const Model = require("../models/Model");
const logger = require("../utils/logger.js")

const alertModel = new Model(`${topics.alert}_Schema`, topics.alert);

/**
 * Sends an alert to the specified topic with validation.
 * @param {Object} model - The alert model.
 * @param {string} model.content - The content of the alert.
 * @param {string} model.level - The severity level of the alert.
 * @throws Will throw an error if 'content' or 'level' is missing.
 */
async function sendAlert(model) {
    if (!model?.content || !model?.level) {
        throw new Error("Invalid alert data: 'content' and 'level' are required.");
    }

    logger.debug("[AlertSender] Sending alert...", model);
    await alertModel.send(model);
}

module.exports = { sendAlert };
