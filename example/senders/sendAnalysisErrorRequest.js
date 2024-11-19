/**
 * example/senders/sendAnalysisErrorRequest.js
 */

const { sendAnalysisErrorRequest } = require("../../src/senders/analysisErrorSender");

(async () => {
    try {
        await sendAnalysisErrorRequest({
            analysisId: "analysis12345",
            errorCode: "400",
            errorMessage: "Invalid input data",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
