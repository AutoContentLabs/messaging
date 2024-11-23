// sender.js
const Redis = require('ioredis');

// Create a new Redis instance
const redis = new Redis();

// Stream name
const streamName = 'test';
console.log(`sender streamName: ${streamName}`);

// The message structure
const pair = {
    key: { id: 0 },
    value: {
        content: "Message"
    },
    headers: {
        correlationId: new Date().toISOString()
    }
};

// Function to simulate sending a single message
async function sendMessage(streamName, pair) {
    await redis.xadd(streamName, '*', 'key', JSON.stringify(pair.key), 'value', JSON.stringify(pair.value), 'headers', JSON.stringify(pair.headers));
}

// Function to send messages at intervals
async function sendTest() {
    let pairsCount = 0;
    const testLimit = 10000; // Stop after sending a certain number of messages
    const processLimit = 1000; // Show all measure
    const startTime = new Date();

    console.log("Start sending messages", startTime);

    const interval = setInterval(async () => {
        try {
            await sendMessage(streamName, pair);
            pairsCount++;
            pair.key.id = pairsCount;

            // Log progress every 1,000 messages
            if (pairsCount % processLimit === 0) {
                const elapsedTime = (new Date() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
            }

            if (pairsCount >= testLimit) {
                clearInterval(interval); // Stop the interval after reaching the limit
                const elapsedTime = (new Date() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
                await redis.quit();
                process.exit(0);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, 10); // Send a message every 10ms
}

// Start sending messages
sendTest().catch(console.error);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    await redis.quit();
    process.exit(0);
});
