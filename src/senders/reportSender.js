// src/senders/reportSender.js
const { sendMessage, topics } = require('../messageService');

function sendReport(taskId, reportType, data) {
    const message = {
        key: `report-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            reportType,
            taskId,
            data,
            status: 'completed',
            message: 'Report generated.'
        }))
    };

    sendMessage(topics.reports, [message]);
}

module.exports = { sendReport };
