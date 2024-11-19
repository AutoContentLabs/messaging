/**
 * example/senders/sendDashboardRequest.js
 */

const { sendDashboardRequest } = require("../../src/senders/dashboardSender");

(async () => {
    try {
        await sendDashboardRequest({
            dashboardId: "dashboard12345",
            reportId: "r12345",
            content: "grid",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
