/**
 * example/senders/sendMetricRequest.js
 */

const { sendMetricRequest } = require("../../src/senders/metricSender");

(async () => {
    try {
        await sendMetricRequest({
            metricId: "metric12345",
            value: 150,
            unit: "?",          
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
