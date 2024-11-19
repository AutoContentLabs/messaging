/**
 * example/senders/sendJobScheduleUpdateRequest.js
 */

const { sendJobScheduleUpdateRequest } = require("../../src/senders/jobScheduleUpdateSender");

(async () => {
    try {
        await sendJobScheduleUpdateRequest({
            jobId: "job12345",
            schedule: new Date().toISOString(),
            updatedBy: "admin"
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
