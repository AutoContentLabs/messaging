// redis/sender.js

// topic = channel = event = queue
const eventName = `test`;
const clientId = `sender.${Math.floor(Math.random() * 1000)}`;
const groupId = `group.test`;

console.log(`sender client: ${clientId} group: ${groupId} event: ${eventName}`);

let testLimit = 1000000; // Limit to stop after consuming a certain number of messages
let processLimit = 1000; // Show measure after every 1,000 messages
let messagesProcessed = 0; // Track number of messages processed
let startTime = new Date(); // Track when the process starts
let totalProcessingTime = 0; // Track the total processing time for messages
let intervalMs = 3000; // Send a message every ms 

const { helper } = require("../../../src");

// The message structure
function createPair(id) {
    const pair = {
        event: eventName,
        key: { id: id },  // Use a UUID for key to avoid relying on counter
        value: { content: "Message" },
        headers: helper.generateHeaders()
    };
    return pair;
}

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

// Setup
const Redis = require('ioredis');

// Create a new Redis instance
const redis = new Redis({
    // Optional configuration for better control over connection
    host: '127.0.0.1', // or 'localhost'
    port: 6379,         // default Redis port
    retryStrategy: (times) => Math.min(times * 50, 2000), // retry connection
    reconnectOnError: (err) => {
        console.log('Reconnecting to Redis...');
        return true; // Reconnect on error
    }
});

// Function to simulate sending a single message
async function sender(eventName, pair) {
    const streamName = eventName;

    try {
        // Sending the message to the Redis stream
        const status = await redis.xadd(streamName, '*', 'key', JSON.stringify(pair.key), 'value', JSON.stringify(pair.value), 'headers', JSON.stringify(pair.headers));
        return status;
    } catch (error) {
        console.error("Error in sendMessage:", error);
        return null;
    }
}

// Main function to send messages
async function send() {
    console.log("Start sending messages", startTime);

    const interval = setInterval(async () => {
        try {
            messagesProcessed++;

            const pair = createPair(messagesProcessed);

            const messageStatus = await sender(eventName, pair);

            if (messageStatus) {
                // Calculate processing stats
                calculateProcessing();
            } else {
                console.log("Failed to send message:", pair.key.id);
            }

            if (messagesProcessed >= testLimit) {
                clearInterval(interval);
                console.log(`[${new Date().toISOString()}] Done processing ${messagesProcessed} messages in ${formatTime((new Date() - startTime) / 1000)}.`);
                await redis.quit();
                process.exit(0);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, intervalMs); // ms
}

// Start sending
send().catch((error) => {
    console.error("Error in sender:", error);
    process.exit(1);
});

// Graceful shutdown on SIGINT
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    try {
        await redis.quit();
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit cleanly on Ctrl+C
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
    console.log("Gracefully shutting down due to SIGTERM...");
    try {
        await redis.quit();
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit cleanly on termination signal
});
