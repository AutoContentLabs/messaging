/**
 * example/senders/sendDataProcessingStatusRequest.js
 */

const { sendDataProcessingStatusRequest } = require("../../src/senders/dataProcessingStatusSender");

(async () => {
    try {
        await sendDataProcessingStatusRequest({
            taskId: "task12345",
            status: "in_progress",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
