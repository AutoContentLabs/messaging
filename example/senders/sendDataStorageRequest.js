/**
 * example/senders/sendDataStorageRequest.js
 */

const { sendDataStorageRequest } = require("../../src/senders/dataStorageSender");

(async () => {
    try {
        await sendDataStorageRequest({
            storageId: "storage12345",
            data: { trendData: [/* some data */] },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
