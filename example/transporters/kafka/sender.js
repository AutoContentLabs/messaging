// kafka/sender.js

// topic = channel = event = queue
const eventName = `test`;
const clientId = `sender.${Math.floor(Math.random() * 1000)}`;
const groupId = `group.test`;

console.log(`sender client: ${clientId} group: ${groupId} event: ${eventName}`);

let testLimit = 1000000; // Limit to stop after consuming a certain number of messages
let processLimit = 1000; // Show measure after every 1,000 messages
let messagesProcessed = 0; // Track number of messages processed
let startTime = new Date(); // Track when the process starts
let totalProcessingTime = 0; // Track the total processing time for messages
let intervalMs = 10; // Send a message every ms 

const { v4: uuidv4 } = require('uuid');

// The message structure
function createPair() {
  const pair = {
    event: eventName,
    key: { id: uuidv4() },  // Use a UUID for key to avoid relying on counter
    value: { content: "Message" },
    headers: { correlationId: uuidv4() }
  };

  return pair;
}

// Helper function to convert seconds into a readable format (days, hours, minutes, seconds)
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

// Calculate processing time for this batch of messages
function calculateProcessing() {
  if (messagesProcessed % processLimit === 0) {
    const elapsedTime = (new Date() - startTime) / 1000; // Total elapsed time in seconds

    // Calculate average processing time per message
    const averageProcessingTime = totalProcessingTime / messagesProcessed;

    // Estimate the remaining time
    const remainingMessages = testLimit - messagesProcessed;
    const estimatedRemainingTime = averageProcessingTime * remainingMessages; // in seconds

    // Format the remaining time in days, hours, minutes, seconds
    const formattedRemainingTime = formatTime(estimatedRemainingTime);

    console.log(`[${new Date().toISOString()}] Processed ${messagesProcessed} elapsedTime: ${elapsedTime}s remaining:${formattedRemainingTime}`);
  }
}

////////////////////
// Kafka-related code
const { Kafka } = require('kafkajs');

const connectionURL = `localhost:9092`;
console.log("Start sending messages to Kafka", connectionURL);

// Create a new Kafka instance
const kafka = new Kafka({
  clientId: clientId,
  brokers: [connectionURL],
  logLevel: 0
});

// Create a Kafka producer
const producer = kafka.producer();

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
        }
      ],
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Function to send messages at regular intervals
async function sendTest() {
  console.log("Start sending messages", startTime);

  // Connect the producer to Kafka (this happens once before sending messages)
  await producer.connect();

  // Use setInterval to send messages at regular intervals
  const interval = setInterval(async () => {
    try {
      messagesProcessed++;

      const pair = createPair();

      // Send individual message
      await sendMessage(eventName, pair);

      // Process time and logging
      // console.log(`Sent message with key: ${pair.key.id}`);

      // Calculate processing stats
      calculateProcessing();

      // If the test limit is reached, stop sending messages
      if (messagesProcessed >= testLimit) {
        clearInterval(interval);
        const elapsedTime = (new Date() - startTime) / 1000; // Elapsed time in seconds
        console.log(`[${new Date().toISOString()}] Done. ${messagesProcessed} messages in ${formatTime(elapsedTime)}.`);

        await producer.disconnect(); // Gracefully disconnect the Kafka producer
        process.exit(0); // Exit gracefully after reaching the limit
      }
    } catch (error) {
      console.error("Error in sending interval:", error);
      clearInterval(interval); // Clear the interval in case of error
    }
  }, intervalMs);
}

// Start sending messages
sendTest().catch(console.error);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log("Gracefully shutting down...");
  await producer.disconnect(); // Disconnect the Kafka producer
  process.exit(0); // Exit cleanly on Ctrl+C
});
