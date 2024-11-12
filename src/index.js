// src/index.js
const transports = require('./transports');


let transport;

switch (transports.config.transport) {
    case 'kafka':
        transport = transports.systems.kafka;
        break;

    default:
        throw new Error(`Unknown transport: ${transports.config.transport}`);
}

function sendMessage(topic, message) {
    return transport.sendMessage(topic, message);
}

function startListener(topic, onMessageCallback) {
    return transport.startListener(topic, onMessageCallback);
}
const topics = transports.topics
module.exports = { sendMessage, startListener, topics };
