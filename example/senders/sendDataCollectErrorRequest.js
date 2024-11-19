/**
 * example/senders/sendDataCollectErrorRequest.js
 */

const { sendDataCollectErrorRequest } = require("../../src/senders/dataCollectErrorSender");

(async () => {
    try {
        await sendDataCollectErrorRequest({
            id: "request12345",
            errorCode: "500",
            errorMessage: "Internal Server Error while fetching data",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
