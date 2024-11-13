// src/senders/jobScheduleSender.js
const { sendMessage, topics } = require('../messageService');

function sendJobScheduleCreate(jobId, taskId, schedule) {
    const message = {
        key: `jobScheduleCreate-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            jobType: 'dataProcessing',
            schedule,
            status: 'scheduled',
            message: 'Job scheduled to start processing collected data.'
        }))
    };

    sendMessage(topics.jobScheduleCreate, [message]);
}

function sendJobScheduleUpdate(jobId, taskId, schedule) {
    const message = {
        key: `jobScheduleUpdate-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            schedule,
            status: 'updated',
            message: 'Job schedule updated.'
        }))
    };

    sendMessage(topics.jobScheduleUpdate, [message]);
}

module.exports = { sendJobScheduleCreate, sendJobScheduleUpdate };
