const { Kafka } = require('kafkajs');

// Create a new Kafka instance
const kafka = new Kafka({
  clientId: 'sender.test',  // Kafka client ID
  brokers: ['localhost:9092'],  // Kafka brokers (adjust if necessary)
  logLevel: 0
});

// Create a Kafka producer
const producer = kafka.producer();

// Topic = channel = event
const eventName = 'test';

let pairsCount = 0;  // Counter for messages sent
const testLimit = 100000;  // Limit to stop after sending a certain number of messages
const startTime = new Date();  // Track when the process starts

// The message structure (similar to your pair in the second example)
const pair = {
  key: { id: 0 },
  value: { content: "Message" },
  headers: { correlationId: new Date().toISOString() }
};

// Function to simulate sending a single message to Kafka
async function sendMessage(eventName, pair) {
  try {
    await producer.send({
      topic: eventName,
      messages: [
        {
          key: JSON.stringify(pair.key),
          value: JSON.stringify(pair.value),
          headers: JSON.stringify(pair.headers)
        }  // Send the pair as a JSON string
      ],
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Function to send messages in intervals (like `sendTest` in the second example)
async function sendTest() {
  console.log("Start test", startTime);

  // Connect the producer to Kafka (this happens once before sending messages)
  await producer.connect();

  // Use setInterval to send messages at regular intervals (every 10ms)
  const interval = setInterval(async () => {
    try {
      // Send individual message
      await sendMessage(eventName, pair);
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
        await producer.disconnect();  // Gracefully disconnect the Kafka producer
        process.exit(0); // Exit gracefully after reaching the limit
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, 10);  // Send a message every 10ms (adjust interval as necessary)
}

// Function to send a batch of messages (like `sendBatchTest` in the second example)
async function sendBatchTest() {
  const batchSize = 1000;
  const pairs = Array(batchSize).fill(pair);  // Generate a batch of identical messages

  try {
    await producer.send({
      topic: eventName,
      messages: pairs.map(pair => ({
        key: JSON.stringify(pair.key),
        value: JSON.stringify(pair.value),
        headers: JSON.stringify(pair.headers)
      }))
    });
    console.log(`Sent a batch of ${pairs.length} messages`);
  } catch (error) {
    console.error("Error sending batch of messages:", error);
  }
}

// Start sending messages
sendTest().catch(console.error);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log("Gracefully shutting down...");
  await producer.disconnect();  // Disconnect the Kafka producer
  process.exit(0);  // Exit cleanly on Ctrl+C
});
