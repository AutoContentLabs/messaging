process.env.APP_LOG_LEVEL = "error"
const { listenMessage } = require("../../src")

// topic = channel = event
const eventName = "test";

let testLimit = 100000;
let pairCount = 0;
const startTime = new Date()

async function listen() {
    console.log("Start test", startTime);

    // Handle listening to the Kafka topic or other messaging service
    await listenMessage(eventName, async ({ key, value, headers }) => {
        pairCount++;

        // Log progress every 10,000 pairs consumed
        if (pairCount % 10000 === 0) {
            const elapsedTime = (new Date() - startTime) / 1000;
            console.log(`Consumed ${pairCount} pairs in ${elapsedTime} seconds`);
        }

        // If the test limit is reached, exit
        if (pairCount >= testLimit) {
            console.log(`Done. Consumed ${pairCount} pairs in ${(Date.now() - startTime) / 1000} seconds.`);
            process.exit(0);
        }
    });
}

// Start the listener and handle errors
listen().catch((error) => {
    console.error("Error in listener:", error);
    process.exit(1); // Exit with an error code
});

// Optionally, handle graceful shutdown on SIGINT (Ctrl+C) or other interrupts
process.on('SIGINT', () => {
    console.log("Gracefully shutting down...");
    process.exit(0); // Exit cleanly on Ctrl+C
});
