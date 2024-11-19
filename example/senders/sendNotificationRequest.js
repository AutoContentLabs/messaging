/**
 * example/senders/sendNotificationRequest.js
 */

const { sendNotificationRequest } = require("../../src/senders/notificationSender");

(async () => {
    try {
        await sendNotificationRequest({
            recipient: "user12345",
            message: "Your scheduled task has completed successfully.",
            type: "info",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
