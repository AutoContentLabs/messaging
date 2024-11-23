const amqp = require('amqplib/callback_api');

// Event name (RabbitMQ queue name)
const eventName = "test";

let pairsCount = 0; // Counter for messages sent
const testLimit = 100000; // Limit to stop after sending a certain number of messages
const startTime = new Date(); // Track when the process starts

// The message structure (same as the pair in the Redis example)
const pair = { key: { id: 0 }, value: { content: "Message" }, headers: { correlationId: new Date().toISOString() } };

// Function to connect to RabbitMQ and send a single message
async function sendMessage(channel, queue, pair) {
    // Convert pair to a JSON string and send it to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(pair)));
}

// Function to send messages in intervals (like `sendTest` in the Redis example)
async function sendTest() {
    console.log("Start test", startTime);

    // Connect to RabbitMQ server
    amqp.connect('amqp://admin:admin@127.0.0.1:5672', (error0, connection) => {
        if (error0) {
            console.error("Error connecting to AMQP:", error0);
            process.exit(1); // Exit if connection fails
        }

        // Create a channel
        connection.createChannel((error1, channel) => {
            if (error1) {
                console.error("Error creating AMQP channel:", error1);
                process.exit(1); // Exit if channel creation fails
            }

            // Assert a queue (create if it doesn't exist)
            channel.assertQueue(eventName, {
                durable: false,
            });

            // Use setInterval to send messages at regular intervals (every 10ms)
            const interval = setInterval(async () => {
                try {
                    // Send individual message
                    await sendMessage(channel, eventName, pair);
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
        });
    });
}

// Function to send a batch of messages (like `sendBatchTest` in Redis)
async function sendBatchTest() {
    const batchSize = 1000;
    const pairs = Array(batchSize).fill(pair); // Generate a batch of identical messages

    amqp.connect('amqp://guest:guest@localhost', (error0, connection) => {
        if (error0) {
            console.error("Error connecting to AMQP:", error0);
            process.exit(1); // Exit if connection fails
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                console.error("Error creating AMQP channel:", error1);
                process.exit(1); // Exit if channel creation fails
            }

            // Assert a queue (create if it doesn't exist)
            channel.assertQueue(eventName, { durable: false });

            try {
                // Send a batch of messages
                pairs.forEach(async (batchPair) => {
                    await sendMessage(channel, eventName, batchPair);
                });
                console.log(`Sent a batch of ${pairs.length} messages`);
            } catch (error) {
                console.error("Error sending batch of messages:", error);
            }
        });
    });
}

// Start sending messages
sendTest().catch(console.error);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    process.exit(0); // Exit cleanly on Ctrl+C
});
