/**
 * example/senders/sendAlertRequest.js
 */

const { sendMessage } = require("../../src");
const { v4: uuidv4 } = require('uuid');

// The message structure
function createPair(eventName, id, model) {
    const pair = {
        event: eventName,
        key: { id: id },
        value: model,
        headers: { correlationId: uuidv4().toString() }
    };

    return pair;
}

const eventName = "test"
const id = Math.floor(Math.random() * 1000)
const model = {
    content: "Critical system failure detected.",
    level: "emerg",
    timestamp: new Date().toISOString()
};

(async () => {
    try {
        const pair = createPair(eventName, id, model)
        await sendMessage(eventName, pair);
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
