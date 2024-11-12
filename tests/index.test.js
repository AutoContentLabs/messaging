// tests/index.test.js

const { sendMessage, startListener, topics } = require("../src");

function onMessageCallback(topic, partition, message) {
    // Assuming the message is binary and needs to be converted back to a string
    const messageString = message.value.toString(); // If message is binary
    console.log(`Received message on topic ${topic}: ${messageString}`);
}

// Use a promise to ensure the listener has started before sending a message
beforeAll(async () => {
    try {
        console.log("Starting Kafka listener...");
        await startListener(topics.DATA_COLLECT_REQUEST, onMessageCallback);
        console.log("Kafka listener started.");
    } catch (error) {
        console.error("Error in starting Kafka listener:", error);
        throw error;  // Ensure Jest fails if listener setup fails
    }
}, 10000);  // Increase timeout for setup

// Test case for sending a message to Kafka
test('Send a message to Kafka', async () => {
    const message = Buffer.from('Test message for DATA_COLLECT_STATUS topic'); // Convert string to binary (Buffer)

    // Send message to Kafka topic
    await sendMessage(topics.DATA_COLLECT_STATUS, [{ value: message }]);

    // Allow time for the message to be consumed and logged
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for a second to allow message processing
}, 10000);  // Increase timeout for this test case as well

