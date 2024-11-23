// listener.js
const Redis = require('ioredis');
const redis = new Redis();

const streamName = 'test';
const consumerGroup = 'group.test';
const consumerName = `consumer-${Math.floor(Math.random() * 1000)}`;
console.log(`listener streamName: ${streamName} consumerGroup: ${consumerGroup} consumerName: ${consumerName}`);

async function createConsumerGroupIfNeeded() {
    try {
        // Create consumer group if not already created
        await redis.xgroup('CREATE', streamName, consumerGroup, '$', 'MKSTREAM');
    } catch (error) {
        if (error.message.includes('BUSYGROUP')) {
            console.log(`Consumer group ${consumerGroup} already exists`);
        } else {
            console.error('Error creating consumer group:', error);
        }
    }
}

const testLimit = 10000; // Stop after sending a certain number of messages
const processLimit = 1000; // Show measure after every 1,000 messages

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

async function processMessages() {
    await createConsumerGroupIfNeeded();

    let messagesProcessed = 0; // Track number of messages processed
    const startTime = new Date(); // Track start time

    let totalProcessingTime = 0; // Track the total processing time for messages

    while (true) {
        const startLoopTime = new Date(); // Track the time taken to process each loop iteration

        const result = await redis.xreadgroup('GROUP', consumerGroup, consumerName, 'BLOCK', 0, 'COUNT', 10, 'STREAMS', streamName, '>');

        if (result && result.length > 0) {
            for (const [stream, messages] of result) {
                for (const [id, fields] of messages) {
                    const message = {
                        key: JSON.parse(fields[1]),  // JSON key
                        value: JSON.parse(fields[3]),  // JSON value
                        headers: JSON.parse(fields[5])  // JSON headers
                    };

                    // Process message (this is where you can handle your logic)
                    await redis.xack(streamName, consumerGroup, id);
                    messagesProcessed++; // Increment processed message count
                }
            }
        }

        // Calculate processing time for this batch of messages
        const loopTime = (new Date() - startLoopTime) / 1000; // Time in seconds
        totalProcessingTime += loopTime;

        // Log total time taken every 1,000 messages
        if (messagesProcessed % processLimit === 0) {
            const elapsedTime = (new Date() - startTime) / 1000; // Total elapsed time in seconds
            console.log(`Processed ${messagesProcessed} messages in total in ${elapsedTime} seconds`);

            // Calculate average processing time per message
            const averageProcessingTime = totalProcessingTime / messagesProcessed;

            // Estimate the remaining time
            const remainingMessages = testLimit - messagesProcessed;
            const estimatedRemainingTime = averageProcessingTime * remainingMessages; // in seconds

            // Format the remaining time in days, hours, minutes, seconds
            const formattedRemainingTime = formatTime(estimatedRemainingTime);

            console.log(`Estimated remaining time: ${formattedRemainingTime}`);
        }

        if (messagesProcessed >= testLimit) {
            break; // Stop processing after reaching the limit
        }
    }
}

processMessages().catch(console.error);

process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    await redis.quit();  // Close Redis connection
    process.exit(0);  // Exit cleanly
});
