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

async function processMessages() {
    await createConsumerGroupIfNeeded();

    let messagesProcessed = 0; // Track number of messages processed
    const startTime = new Date(); // Track start time

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

        // Log the time taken for each loop iteration (message processing)
        const loopTime = (new Date() - startLoopTime) / 1000; // Time in seconds
        //console.log(`Processed ${messagesProcessed} messages in this loop (Time taken: ${loopTime} seconds)`);

        // Log total time taken every 1,000 messages
        if (messagesProcessed % processLimit === 0) {
            const elapsedTime = (new Date() - startTime) / 1000; // Total elapsed time in seconds
            console.log(`Processed ${messagesProcessed} messages in total in ${elapsedTime} seconds`);
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
