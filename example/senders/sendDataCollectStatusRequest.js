/**
 * example/senders/sendDataCollectStatusRequest.js
 */

const { sendDataCollectStatusRequest } = require("../../src/senders/dataCollectStatusSender");

(async () => {
    try {
        await sendDataCollectStatusRequest({
            id: "request12345",
            status: "in_progress",
            message: "Data collection is currently being processed.",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
