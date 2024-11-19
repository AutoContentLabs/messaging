/**
 * example/senders/sendJobProgressRequest.js
 */

const { sendJobProgressRequest } = require("../../src/senders/jobProgressSender");

(async () => {
    try {
        await sendJobProgressRequest({
            jobId: "job12345",
            progress: 75,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
