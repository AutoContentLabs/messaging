/**
 * example/senders/sendJobStatusRequest.js
 */

const { sendJobStatusRequest } = require("../../src/senders/jobStatusSender");

(async () => {
    try {
        await sendJobStatusRequest({
            jobId: "job12345",
            status: "running",
            progress: 50,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
