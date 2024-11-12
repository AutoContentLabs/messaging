# @auto-content-labs/messaging

## Installation

```
const { sendMessage, startListener, topics } = require('@auto-content-labs/messaging');

function onMessageCallback(topic, partition, message) {
    // Assuming the message is binary and needs to be converted back to a string
    const messageString = message.value.toString(); // If message is binary
    console.log(`Received message on topic ${topic}: ${messageString}`);
}

try {
    console.log("Starting Kafka listener...");
    await startListener(topics.DATA_COLLECT_REQUEST, onMessageCallback);
    console.log("Kafka listener started.");
} catch (error) {
    console.error("Error in starting Kafka listener:", error);
    throw error;  // Ensure Jest fails if listener setup fails
}

const message = Buffer.from('Test message for DATA_COLLECT_STATUS topic'); // Convert string to binary (Buffer)

// Send message to Kafka topic
await sendMessage(topics.DATA_COLLECT_STATUS, [{ value: message }]);
```