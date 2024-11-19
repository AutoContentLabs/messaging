/**
 * example/senders/sendDataCollectRequestRequest.js
 */

const { sendDataCollectRequestRequest } = require("../../src/senders/dataCollectRequestSender");

(async () => {
    try {
        await sendDataCollectRequestRequest({
            id: "request12345",
            source: "Google Trends",
            params: { category: "technology", region: "US" },
            priority: "high",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
