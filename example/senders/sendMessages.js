process.env.APP_LOG_LEVEL="warning"
const { sendMessage, sendMessages } = require("../../src");

const startTime = Date.now();
let pairsCount = 0;
const testLimit = 100000;
// Topic = channel = event
const eventName = "test";

const pair = { key: { id: 0 }, value: { content: "Message" }, headers: { correlationId: new Date().toISOString() } };

async function sendTest() {
    const startTime = new Date()
    console.log("start test", startTime)

    const interval = setInterval(async () => {
        try {
            // Send individual messages
            await sendMessage(eventName, pair);
            pairsCount++;

            // Log progress every 10,000 messages
            if (pairsCount % 10000 === 0) {
                const elapsedTime = (new Date() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
            }

            // Once the limit is reached, stop sending
            if (pairsCount >= testLimit) {
                clearInterval(interval);
                const elapsedTime = (Date.now() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, 10); // 10ms interval to send messages
}

async function sendBatchTest() {
    // Generate a batch of pairs (can be dynamically sized)
    const batchSize = 1000;
    const pairs = Array(batchSize).fill(pair); // A batch of identical messages for testing

    try {
        await sendMessages(eventName, pairs);
        console.log(`Sent a batch of ${pairs.length} messages`);
    } catch (error) {
        console.error("Error sending batch of messages:", error);
    }
}

// Call the test functions
sendTest().catch(console.error);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    // Add any cleanup logic here, like closing connections, etc.
    process.exit(0); // Exit after clean up
});
