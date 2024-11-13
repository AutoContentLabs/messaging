// src/messageService.js
const transports = require('./transports');
const logger = require('./utils/logger');

let transport;

switch (transports.config.transport) {
    case 'kafka':
        transport = transports.systems.kafka;
        break;

    default:
        throw new Error(`Unknown transport: ${transports.config.transport}`);
}

const topics = transports.topics;

async function sendMessage(topic, messageArray) {
    try {
        await transport.sendMessage(topic, messageArray);
        logger.info(`Message sent to ${topic} via ${transports.config.transport}`);
    } catch (error) {
        logger.error(`Failed to send message to ${topic}: ${error.message}`);
        throw error;
    }
}

async function startListener(topic, onMessage) {
    try {
        await transport.startListener(topic, onMessage);
        logger.info(`Listening [${topic}] [${transports.config.transport}]`);
    } catch (error) {
        logger.error(`Failed to start listener for ${topic}: ${error.message}`);
        throw error;
    }
}

module.exports = { sendMessage, startListener, topics };
