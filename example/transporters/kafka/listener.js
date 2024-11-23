// kafka/listener.js

// // The message structure it should be
// const pair = {
//     event: eventName,
//     key: { id: messagesProcessed },
//     value: { content: "Message" },
//     headers: { correlationId: uuidv4().toString() }
//   };

// topic = channel = event = queue
const eventName = `test`;
const clientId = `listener.${Math.floor(Math.random() * 1000)}`;
const groupId = `group.test`;

console.log(`listener client: ${clientId} group: ${groupId} event: ${eventName}`);

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

        console.log(`[${new Date().toISOString()}] Processed ${messagesProcessed}  elapsedTime: ${elapsedTime}s remaining:${formattedRemainingTime}`);
    }
}

// Kafka consumer code
const { Kafka } = require('kafkajs');

const connectionURL = `localhost:9092`;
console.log("Start listening", connectionURL);

// Create a new Kafka instance
const kafka = new Kafka({
    clientId: clientId,  // Kafka client ID
    brokers: [connectionURL],  // Kafka brokers (adjust if necessary),
    logLevel: 0
});

// Create a Kafka consumer
const consumer = kafka.consumer({
    groupId: groupId,
    allowAutoTopicCreation: true
});

// Simulate the 'listenMessage' function, similar to the Kafka-like pattern
async function listenMessage(eventName, callback) {
    await consumer.connect();

    try {
        // Subscribe to the Kafka topic
        await consumer.subscribe({ topic: eventName, fromBeginning: true });
    } catch (error) {
        console.error("Error subscribing to topic:"); // Log the error
        return; // Skip processing this message if parsing fails
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const startLoopTime = new Date(); // Track time to process each loop iteration

            if (topic === eventName) {
                try {
                    const value = JSON.parse(message.value.toString());  // Assuming message is in JSON format
                    const key = JSON.parse(message.key.toString());  // Assuming message is in JSON format

                    callback({ event: topic, key, value });
                } catch (err) {
                    console.error("Error parsing message:", err);
                    return; // Skip processing this message if parsing fails
                }
            }

            // Calculate processing time for this batch of messages
            const loopTime = (new Date() - startLoopTime) / 1000; // Time in seconds
            totalProcessingTime += loopTime;
        }
    });
}

async function handler({ event, key, value, headers }) {
    // Process the message
    // console.log("event", event);
    // console.log("key", key);
    // console.log("value", value);
    // console.log("headers", headers);
}

// Function to start listening and processing messages
async function listen() {
    console.log("Start test", startTime);

    await listenMessage(eventName, ({ event, key, value, headers }) => {
        messagesProcessed++;
        handler({ event, key, value, headers });

        calculateProcessing();

        if (messagesProcessed >= testLimit) {
            console.log(`[${new Date().toISOString()}] Done. ${messagesProcessed} in ${formatTime((new Date() - startTime) / 1000)}.`);
            process.exit(0);
        }
    });
}

// Start the listener and handle errors
listen().catch((error) => {
    console.error("Error in listener:", error);
    process.exit(1);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    await consumer.disconnect(); // Ensure graceful shutdown
    process.exit(0);  // Exit cleanly on Ctrl+C
});
