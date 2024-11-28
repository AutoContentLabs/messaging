/**
 * example/senders/sendAlertRequest.js
 */

const { sendMessage, helper } = require("../../src");

// The message structure
function createPair(eventName, id, model) {
    const pair = {
        event: eventName,
        key: { id: id },
        value: model,
        headers: { correlationId: helper.generateId(16) }
    };

    return pair;
}

const eventName = "test"
const id = helper.generateId(8)
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
