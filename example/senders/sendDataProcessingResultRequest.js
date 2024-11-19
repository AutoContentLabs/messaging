/**
 * example/senders/sendDataProcessingResultRequest.js
 */

const { sendDataProcessingResultRequest } = require("../../src/senders/dataProcessingResultSender");

(async () => {
    try {
        await sendDataProcessingResultRequest({
            taskId: "task12345",
            result: { processedData: [/* some data */] },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
