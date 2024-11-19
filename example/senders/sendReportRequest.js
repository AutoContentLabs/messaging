/**
 * example/senders/sendReportRequest.js
 */

const { sendReportRequest } = require("../../src/senders/reportSender");

(async () => {
    try {
        await sendReportRequest({
            reportId: "report12345",
            content: "trend_analysis",
            generatedBy: "user12345",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
