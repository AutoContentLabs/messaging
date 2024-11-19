/**
 * example/senders/sendAlertRequest.js
 */

const { sendAlertRequest } = require("../../src/senders/alertSender");

(async () => {
    try {
        await sendAlertRequest({
            content: "Critical system failure detected.",
            level: "emerg",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
