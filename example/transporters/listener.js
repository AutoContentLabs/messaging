// listenMessage.js

// listener configuration
const eventName = `test`;
const clientId = `listener.${Math.floor(Math.random() * 1000)}`;
const groupId = `group.test`;
const connectionURL = `localhost:9092`;

let testLimit = 1000000; // Limit to stop after consuming a certain number of messages
let processLimit = 1000; // Show measure after every 1,000 messages
let messagesProcessed = 0; // Track number of messages processed
let startTime = new Date(); // Track when the process starts
let totalProcessingTime = 0; // Track the total processing time for messages

console.log(`Listener started with clientId: ${clientId}, groupId: ${groupId}, event: ${eventName}`);

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

function calculateProcessing() {
    if (messagesProcessed % processLimit === 0) {
        const elapsedTime = (new Date() - startTime) / 1000; // Total elapsed time in seconds
        const averageProcessingTime = totalProcessingTime / messagesProcessed;
        const remainingMessages = testLimit - messagesProcessed;
        const estimatedRemainingTime = averageProcessingTime * remainingMessages;
        const formattedRemainingTime = formatTime(estimatedRemainingTime);

        console.log(`[${new Date().toISOString()}] Processed ${messagesProcessed} messages, elapsedTime: ${elapsedTime}s, remaining: ${formattedRemainingTime}`);
    }
}

// setup
process.env.APP_LOG_LEVEL = "debug"
const { listenMessage } = require("../../src")

async function handler({ event, key, value, headers }) {
    // Process the message here
    console.log("event", event)
    console.log("key", key)
    console.log("value", value)
    console.log("headers", headers)
}

async function listener(eventName, callback) {
    // Handle listening to the Kafka topic or other messaging service
    await listenMessage(eventName, async ({ key, value, headers }) => {
console.log("a")
        const startLoopTime = new Date();

        callback({ event: eventName, key, value, headers });

        const loopTime = (new Date() - startLoopTime) / 1000;
        totalProcessingTime += loopTime;
    });
}
async function listen() {
    console.log("Starting the listener process...");

    await listener(eventName, async ({ event, key, value, headers }) => {
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

process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log("Gracefully shutting down due to SIGTERM...");
    process.exit(0);
});
