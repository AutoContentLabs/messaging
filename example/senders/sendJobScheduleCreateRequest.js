/**
 * example/senders/sendJobScheduleCreateRequest.js
 */

const { sendJobScheduleCreateRequest } = require("../../src/senders/jobScheduleCreateSender");

(async () => {
    try {
        await sendJobScheduleCreateRequest({
            jobId: "job12345",
            schedule: new Date().toISOString(),
            createdBy: "admin",
            priority: "medium"
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
