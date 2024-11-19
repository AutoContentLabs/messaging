/**
 * example/senders/sendAnalysisResultRequest.js
 */

const { sendAnalysisResultRequest } = require("../../src/senders/analysisResultSender");

(async () => {
    try {
        await sendAnalysisResultRequest({
            analysisId: "analysis12345",
            resultData: { analysisSummary: "Positive trends detected." },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
