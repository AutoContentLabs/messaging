// redis/listener.js

const eventName = `test`;
const clientId = `listener.${Math.floor(Math.random() * 1000)}`;
const groupId = `group.test`;

console.log(`Listener started with clientId: ${clientId}, groupId: ${groupId}, event: ${eventName}`);

let testLimit = 1000000; // Limit to stop after consuming a certain number of messages
let processLimit = 1000; // Show measure after every 1,000 messages
let messagesProcessed = 0; // Track number of messages processed
let startTime = new Date(); // Track when the process starts
let totalProcessingTime = 0; // Track the total processing time for messages

// Helper function to convert seconds into a readable format (days, hours, minutes, seconds)
function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let timeString = '';
    if (days > 0) timeString += `${days} day(s) `;
    if (hours > 0) timeString += `${hours} hour(s) `;
    if (minutes > 0) timeString += `${minutes} minute(s) `;
    if (secs > 0) timeString += `${secs} second(s)`;

    return timeString.trim();
}

// Calculate processing time for this batch of messages
function calculateProcessing() {
    if (messagesProcessed % processLimit === 0) {
        const elapsedTime = (new Date() - startTime) / 1000; // Total elapsed time in seconds

        // Calculate average processing time per message
        const averageProcessingTime = totalProcessingTime / messagesProcessed;

        // Estimate the remaining time
        const remainingMessages = testLimit - messagesProcessed;
        const estimatedRemainingTime = averageProcessingTime * remainingMessages; // in seconds

        // Format the remaining time in days, hours, minutes, seconds
        const formattedRemainingTime = formatTime(estimatedRemainingTime);

        console.log(`[${new Date().toISOString()}] Processed ${messagesProcessed} messages, elapsedTime: ${elapsedTime}s, remaining: ${formattedRemainingTime}`);
    }
}

// Setup Redis connection
const Redis = require('ioredis');
const redis = new Redis();

redis.on('error', (error) => {
    console.error('Redis connection error:', error);
    process.exit(1);
});

async function createConsumerGroupIfNeeded() {
    try {
        // Create consumer group if not already created
        await redis.xgroup('CREATE', eventName, groupId, '$', 'MKSTREAM');
    } catch (error) {
        if (error.message.includes('BUSYGROUP')) {
            console.log(`Consumer group ${groupId} already exists`);
        } else {
            console.error('Error creating consumer group:', error);
        }
    }
}

async function handler({ event, key, value, headers }) {
    // Process the message here
    console.log("event", event)
    console.log("key", key)
    console.log("value", value)
    console.log("headers", headers)
}

// Simulate the 'listenMessage'
async function listenMessage(eventName, callback) {
    await createConsumerGroupIfNeeded();

    while (messagesProcessed < testLimit) {
        const startLoopTime = new Date(); // Track the time taken to process each loop iteration

        try {
            const result = await redis.xreadgroup('GROUP', groupId, clientId, 'BLOCK', 0, 'COUNT', 10, 'STREAMS', eventName, '>');

            if (result && result.length > 0) {
                for (const [stream, messages] of result) {
                    for (const [id, fields] of messages) {
                        try {
                            const message = {
                                key: JSON.parse(fields[1]),  // JSON key
                                value: JSON.parse(fields[3]),  // JSON value
                                headers: JSON.parse(fields[5])  // JSON headers
                            };

                            await callback({ event: eventName, key: message.key, value: message.value, headers: message.headers });

                            // Process message (this is where you can handle your logic)
                            await redis.xack(eventName, groupId, id);

                        } catch (err) {
                            console.error("Error processing message:", err);
                            continue; // Skip processing this message and continue with others
                        }
                    }
                }
            }

            // Calculate processing time for this batch of messages
            const loopTime = (new Date() - startLoopTime) / 1000; // Time in seconds
            totalProcessingTime += loopTime;
            await calculateProcessing();

        } catch (err) {
            console.error("Error reading from stream:", err);
            continue; // Skip this iteration in case of error, but keep trying to consume more messages
        }
    }
}

async function listen() {
    console.log("Starting the listener process...");
    await listenMessage(eventName, async ({ event, key, value, headers }) => {
        messagesProcessed++;
        await handler({ event, key, value, headers });
        await calculateProcessing();

        if (messagesProcessed >= testLimit) {
            console.log(`[${new Date().toISOString()}] Done processing ${messagesProcessed} messages in ${formatTime((new Date() - startTime) / 1000)}.`);
            process.exit(0);
        }
    });
}

listen().catch((error) => {
    console.error("Error in listener:", error);
    process.exit(1);
});

// Graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");

    await redis.quit();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log("Gracefully shutting down due to SIGTERM...");

    await redis.quit();
    process.exit(0);
});
