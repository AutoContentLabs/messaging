/**
 * example/senders/sendLogRequest.js
 */

const { sendLogRequest } = require("../../src/senders/logSender");

(async () => {
    try {
        await sendLogRequest({
            logId: "log12345",
            message: "Data processing completed successfully.",
            level: "info",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
