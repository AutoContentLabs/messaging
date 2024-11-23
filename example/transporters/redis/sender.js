const Redis = require('ioredis');

// Create a new Redis instance
const redis = new Redis();

// Topic = channel = event
const eventName = "test";

let pairsCount = 0; // Counter for messages sent
const testLimit = 100000; // Limit to stop after sending a certain number of messages
const startTime = new Date(); // Track when the process starts

// The message structure (similar to your pair in the second example)
const pair = { key: { id: 0 }, value: { content: "Message" }, headers: { correlationId: new Date().toISOString() } };

// Function to simulate sending a single message, similar to `sendMessage`
async function sendMessage(eventName, pair) {
    // Publish the message to the Redis channel
    await redis.publish(eventName, JSON.stringify(pair)); // Convert pair to a JSON string before sending
}

// Function to send messages in intervals (like `sendTest` in the second example)
async function sendTest() {
    console.log("Start test", startTime);

    // Use setInterval to send messages at regular intervals (every 10ms)
    const interval = setInterval(async () => {
        try {
            // Send individual message
            await sendMessage(eventName, pair);
            pairsCount++;

            // Log progress every 10,000 messages
            if (pairsCount % 10000 === 0) {
                const elapsedTime = (new Date() - startTime) / 1000; // Elapsed time in seconds
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
            }

            // If the test limit is reached, stop sending
            if (pairsCount >= testLimit) {
                clearInterval(interval);
                const elapsedTime = (new Date() - startTime) / 1000; // Elapsed time in seconds
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
                process.exit(0); // Exit gracefully after reaching the limit
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, 10); // Send a message every 10ms (adjust interval as necessary)
}

// Function to send a batch of messages (like `sendBatchTest`)
async function sendBatchTest() {
    const batchSize = 1000;
    const pairs = Array(batchSize).fill(pair); // Generate a batch of identical messages

    try {
        for (const batchPair of pairs) {
            await sendMessage(eventName, batchPair);
        }
        console.log(`Sent a batch of ${pairs.length} messages`);
    } catch (error) {
        console.error("Error sending batch of messages:", error);
    }
}

// Start sending messages
sendTest().catch(console.error);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    redis.quit(); // Close the Redis connection
    process.exit(0); // Exit cleanly on Ctrl+C
});
