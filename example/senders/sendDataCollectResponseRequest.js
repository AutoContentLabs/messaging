/**
 * example/senders/sendDataCollectResponseRequest.js
 */

const { sendDataCollectResponseRequest } = require("../../src/senders/dataCollectResponseSender");

(async () => {
    try {
        await sendDataCollectResponseRequest({
            id: "request12345",
            data: { trendData: [/* some data */] },
            timestamp: new Date().toISOString(),
            summary: {
                source: 'url',
                itemCount: 0,
                dataFormat: typeof data,
                processingTime: 1
            }
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
