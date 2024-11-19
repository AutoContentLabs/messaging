/**
 * example/senders/sendDataAggregationRequest.js
 */

const { sendDataAggregationRequest } = require("../../src/senders/dataAggregationSender");

(async () => {
    try {
        await sendDataAggregationRequest({
            aggregationId: "agg12345",
            aggregatedData: { aggregatedTrends: [/* some aggregated data */] },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
