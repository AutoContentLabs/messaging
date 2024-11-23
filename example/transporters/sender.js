
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

const { v4: uuidv4 } = require('uuid');

// The message structure
function createPair() {
    const pair = {
        event: eventName,
        key: { id: messagesProcessed },  // Use a UUID for key to avoid relying on counter
        value: { content: "Message" },
        headers: { correlationId: uuidv4().toString() }
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

        console.log(`[${new Date().toISOString()}] Processed ${messagesProcessed} elapsedTime: ${elapsedTime}s remaining:${formattedRemainingTime}`);
    }
}

// setup
process.env.APP_LOG_LEVEL = "error"
const { sendMessage, sendMessages } = require("../../src");

async function sender(eventName, pair) {
    try {
        // Send individual messages
        let status = await sendMessage(eventName, pair);
        return status
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

async function send() {

    console.log("Start sending messages", startTime);

    // Use a while loop for sending messages at regular intervals
    while (messagesProcessed < testLimit) {
        try {
            // Pause between sending each message
            await new Promise(resolve => setTimeout(resolve, intervalMs));
            messagesProcessed++;

            const pair = createPair();

            // Send individual message
            const messageStatus = await sender(eventName, pair);

            // Calculate processing stats
            calculateProcessing();

            // If the test limit is reached, stop sending messages
            if (messagesProcessed >= testLimit) {
                const elapsedTime = (new Date() - startTime) / 1000; // Elapsed time in seconds
                console.log(`[${new Date().toISOString()}] Done. ${messagesProcessed} messages in ${formatTime(elapsedTime)}.`);

                await producer.disconnect(); // Gracefully disconnect the Kafka producer
                process.exit(0); // Exit gracefully after reaching the limit
            }
        } catch (error) {
            console.error("Error in sending message:", error);
            break; // Exit the loop on error
        }
    }
}


send().catch((error) => {
    console.error("Error in sender:", error);
    process.exit(1);
});

// Graceful shutdown on SIGINT
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    try {
        
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit cleanly on Ctrl+C
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
    console.log("Gracefully shutting down due to SIGTERM...");
    try {
        
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit cleanly on termination signal
});
