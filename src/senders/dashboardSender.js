// src/senders/dashboardSender.js
const { sendMessage, topics } = require('../messageService');

function sendDashboardUpdate(taskId, stats) {
    const message = {
        key: `dashboard-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            stats, // Example: { 'AI in healthcare': 15000, 'Quantum Computing': 12000 }
            message: 'Dashboard updated with trend statistics.'
        }))
    };

    sendMessage(topics.dashboard, [message]);
}

module.exports = { sendDashboardUpdate };
