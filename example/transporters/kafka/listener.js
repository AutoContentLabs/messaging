const { Kafka } = require('kafkajs');

// Create a new Kafka instance
const kafka = new Kafka({
    clientId: 'listener.test',  // Kafka client ID
    brokers: ['localhost:9092'],  // Kafka brokers (adjust if necessary),
    logLevel:0
});

// Create a Kafka consumer
const consumer = kafka.consumer({ groupId: 'group.test' });

// Topic = channel = event
const eventName = 'test';

let testLimit = 100000;  // Limit to stop after consuming a certain number of messages
let pairCount = 0;       // Counter for consumed messages
const startTime = new Date();  // Track when the process starts

// Simulate the 'listenMessage' function, similar to the Kafka-like pattern
async function listenMessage(eventName, callback) {
    // Ensure the consumer is connected before subscribing and consuming messages
    await consumer.connect();

    // Subscribe to the Kafka topic
    await consumer.subscribe({ topic: eventName, fromBeginning: true });

    // Consume messages from the Kafka topic
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic === eventName) {
                // Simulate the message structure with key, value, headers
                const parsedMessage = JSON.parse(message.value.toString());  // Assuming message is in JSON format
                const { key, value, headers } = parsedMessage;

                // Call the provided callback with the message content
                callback({ key, value, headers });
            }
        }
    });
}

// Function to start listening and processing messages
async function listen() {
    console.log("Start test", startTime);

    // Call listenMessage to start listening to the Kafka topic
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
            process.exit(0);  // Exit after reaching the limit
        }
    });
}

// Start the listener and handle errors
listen().catch((error) => {
    console.error("Error in listener:", error);
    process.exit(1);  // Exit with an error code if the listener fails
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    await consumer.disconnect();  // Disconnect the Kafka consumer
    process.exit(0);  // Exit cleanly on Ctrl+C
});
