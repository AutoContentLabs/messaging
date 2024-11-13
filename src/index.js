const { sendMessage, startListener, topics } = require("./messageService");
const { onMessage } = require("./messageHandler");
const senders = require("./senders");

module.exports = {
    sendMessage,
    startListener,
    onMessage,
    topics,
    ...senders,  // Import all senders as part of the exports
};
