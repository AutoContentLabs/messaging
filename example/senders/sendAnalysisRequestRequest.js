/**
 * example/senders/sendAnalysisRequestRequest.js
 */

const { sendAnalysisRequestRequest } = require("../../src/senders/analysisRequestSender");

(async () => {
    try {
        await sendAnalysisRequestRequest({
            analysisId: "analysis12345",
            requestData: {
                trend: "positive",
                message: "Trend analysis completed successfully"
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
