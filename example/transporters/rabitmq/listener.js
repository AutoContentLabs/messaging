const amqp = require('amqplib/callback_api');

// Event name (RabbitMQ queue name)
const eventName = "test";

let testLimit = 100000; // Limit to stop after consuming a certain number of messages
let pairCount = 0; // Counter for consumed messages
const startTime = new Date(); // Track when the process starts

// Function to simulate listening to the AMQP queue, similar to the Redis version
async function listenMessage(queueName, callback) {
    return new Promise((resolve, reject) => {
        // Connect to RabbitMQ server
        amqp.connect('amqp://admin:admin@127.0.0.1:5672', (error0, connection) => {
            if (error0) {
                reject("Error connecting to AMQP: " + error0);
                return;
            }

            // Create a channel
            connection.createChannel((error1, channel) => {
                if (error1) {
                    reject("Error creating AMQP channel: " + error1);
                    return;
                }

                // Assert a queue (create it if it doesn't exist)
                channel.assertQueue(queueName, {
                    durable: false,
                });

                console.log(`Waiting for messages in queue: ${queueName}`);

                // Consume messages from the queue
                channel.consume(queueName, (msg) => {
                    // Parse the incoming message (assuming it's in JSON format)
                    const message = msg.content.toString();
                    const parsedMessage = {
                        key: { id: pairCount + 1 },
                        value: { content: message },
                        headers: {}
                    };

                    // Call the provided callback with the message content
                    callback(parsedMessage);
                }, {
                    noAck: true, // Automatically acknowledge the message after processing
                });

                resolve();
            });
        });
    });
}

// Function to start listening and processing messages
async function listen() {
    console.log("Start test", startTime);

    // Call listenMessage to start listening to the RabbitMQ queue
    await listenMessage(eventName, ({ key, value, headers }) => {
        pairCount++;

        // Log progress every 10,000 pairs consumed
        if (pairCount % 10000 === 0) {
            const elapsedTime = (new Date() - startTime) / 1000;
            console.log(`Consumed ${pairCount} pairs in ${elapsedTime} seconds`);
        }

        // If the test limit is reached, exit the process
        if (pairCount >= testLimit) {
            console.log(`Done. Consumed ${pairCount} pairs in ${(new Date() - startTime) / 1000} seconds.`);
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
    process.exit(0); // Exit cleanly on Ctrl+C
});
