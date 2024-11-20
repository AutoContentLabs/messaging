/**
 * A flexible messaging system
 */

const { topics } = require("./topics");
const handlers = require("./handlers");
const senders = require("./senders");
const listeners = require("./listeners");
const eventHub = require("./eventHub");

module.exports = {
    eventHub,
    events: topics,
    ...handlers,  // Import all handlers as part of the exports
    ...senders,  // Import all senders as part of the exports    
    ...listeners,  // Import all listeners as part of the exports
};
