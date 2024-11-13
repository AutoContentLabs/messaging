// src/senders/dataAggregationSender.js
const { sendMessage, topics } = require('../messageService');

function sendDataAggregation(jobId, taskId, aggregatedData) {
    const message = {
        key: `dataAggregation-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            aggregatedData, // Example: { 'AI in healthcare': 35000, 'Quantum Computing': 24000 }
            status: 'aggregated',
            message: 'Data aggregation completed.'
        }))
    };

    sendMessage(topics.dataAggregation, [message]);
}

module.exports = { sendDataAggregation };
