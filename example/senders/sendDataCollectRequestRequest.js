/**
 * example/senders/sendDataCollectRequestRequest.js
 */


const { sendDataCollectRequestRequest } = require("../../src/senders/dataCollectRequestSender");

(async () => {
    try {

        await sendDataCollectRequestRequest({
            id: "test-1",
            source: "test",
            params: { url: "example.com" },
            priority: "high",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
