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

// Function to convert seconds into a readable format (days, hours, minutes, seconds)
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

// Function to send messages at intervals
async function sendTest() {
    let pairsCount = 0;
    const testLimit = 1000000; // Stop after sending a certain number of messages
    const processLimit = 1000; // Show all measure
    const startTime = new Date();
    let previousTime = startTime;

    console.log("Start sending messages", startTime);

    const interval = setInterval(async () => {
        try {
            await sendMessage(streamName, pair);
            pairsCount++;
            pair.key.id = pairsCount;

            // Log progress every 1,000 messages
            if (pairsCount % processLimit === 0) {
                const elapsedTime = (new Date() - startTime) / 1000; // elapsed time in seconds
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);

                // Calculate average time per message
                const averageTimePerMessage = elapsedTime / pairsCount; // in seconds

                // Calculate remaining time based on average time
                const remainingMessages = testLimit - pairsCount;
                const estimatedRemainingTime = averageTimePerMessage * remainingMessages; // in seconds

                // Format the remaining time in days, hours, minutes, seconds
                const formattedRemainingTime = formatTime(estimatedRemainingTime);

                console.log(`Estimated remaining time: ${formattedRemainingTime}`);
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
