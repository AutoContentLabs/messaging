// rabitmq/listener.js

const amqp = require('amqplib');
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

// Setup
const connectionURL = `amqp://admin:admin@127.0.0.1:5672`;
const connection = await amqp.connect(connectionURL);
const channel = await connection.createChannel();

// Simulate the 'listenMessage'
async function listenMessage(eventName, callback) {
    const queue = eventName;

    try {
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
    } catch (error) {
        console.error("Error asserting queue:", error);
        return; // Skip processing if queue assertion fails
    }

    console.log(`[${clientId}] is waiting for messages...`);

    channel.consume(queue, async (msg) => {
        const startLoopTime = new Date();

        if (msg !== null) {
            try {
                const message = JSON.parse(msg.content.toString());
                const { key, value, headers } = message;

                await callback({ event: queue, key, value, headers });

                // Acknowledge the message after processing
                channel.ack(msg);
            } catch (err) {
                console.error("Error parsing message:", err);
                return; // Skip processing this message if parsing fails
            }
        }

        // Calculate processing time for this batch of messages
        const loopTime = (new Date() - startLoopTime) / 1000; // Time in seconds
        totalProcessingTime += loopTime;
    });
}

async function handler({ event, key, value, headers }) {
    // Process the message here
    // For example: console.log("event", event, "key", key, "value", value, "headers", headers);
}

async function listen() {
    console.log("Start test", startTime);


    await listenMessage(eventName, async ({ event, key, value, headers }) => {
        messagesProcessed++;
        await handler({ event, key, value, headers });
        await calculateProcessing();

        if (messagesProcessed >= testLimit) {
            console.log(`[${new Date().toISOString()}] Done processing ${messagesProcessed} messages in ${formatTime((new Date() - startTime) / 1000)}.`);
            await channel.close();
            await connection.close();
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

    await channel.close();
    await connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log("Gracefully shutting down due to SIGTERM...");

    await channel.close();
    await connection.close();
    process.exit(0);
});
