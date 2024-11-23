const Redis = require('ioredis');

// Create a new Redis instance
const redis = new Redis();

// topic = channel = event
const eventName = "test";

let testLimit = 100000; // Limit to stop after consuming a certain number of messages
let pairCount = 0; // Counter for consumed messages
const startTime = new Date(); // Track when the process starts

// Simulate the 'listenMessage' function, similar to the Kafka-like pattern
async function listenMessage(eventName, callback) {
    return new Promise((resolve, reject) => {
        // Subscribe to the Redis channel
        redis.subscribe(eventName, (err, count) => {
            if (err) {
                reject("Error subscribing to channel: " + err);
            } else {
                console.log(`Subscribed to ${count} channel(s)`);
                resolve();
            }
        });

        // Listen for messages on the Redis channel
        redis.on('message', (channel, message) => {
            if (channel === eventName) {
                // Simulating the message structure with key, value, headers
                const parsedMessage = JSON.parse(message); // Assuming message is in JSON format
                const { key, value, headers } = parsedMessage;

                // Call the provided callback with the message content
                callback({ key, value, headers });
            }
        });
    });
}

// Function to start listening and processing messages
async function listen() {
    console.log("Start test", startTime);

    // Call listenMessage to start listening to the Redis channel
    await listenMessage(eventName, ({ key, value, headers }) => {
        pairCount++;
        
        // Log progress every 10,000 pairs consumed
        if (pairCount % 10000 === 0) {
            const elapsedTime = (new Date() - startTime) / 1000;
            console.log(`Consumed ${pairCount} pairs in ${elapsedTime} seconds`);
        }

        // If the test limit is reached, exit the process
        if (pairCount >= testLimit) {
            console.log(`Done. Consumed ${pairCount} pairs in ${(Date.now() - startTime) / 1000} seconds.`);
            process.exit(0); // Exit after reaching the limit
        }
    });
}

// Start the listener and handle errors
listen().catch((error) => {
    console.error("Error in listener:", error);
    process.exit(1); // Exit with an error code if the listener fails
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log("Gracefully shutting down...");
    redis.quit(); // Close the Redis connection
    process.exit(0); // Exit cleanly on Ctrl+C
});
