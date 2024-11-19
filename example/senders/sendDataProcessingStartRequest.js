/**
 * example/senders/sendDataProcessingStartRequest.js
 */

const { sendDataProcessingStartRequest } = require("../../src/senders/dataProcessingStartSender");

(async () => {
    try {
        await sendDataProcessingStartRequest({
            taskId: "task12345",
            startTime: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
