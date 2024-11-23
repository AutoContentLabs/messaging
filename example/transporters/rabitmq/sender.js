// rabitmq/sender.js

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
let intervalMs = 3000; // Send a message every ms 

const { v4: uuidv4 } = require('uuid');

// The message structure
function createPair(id) {
    const pair = {
        event: eventName,
        key: { id: id },  // Use a UUID for key to avoid relying on counter
        value: { content: "Message" },
        headers: { correlationId: uuidv4().toString() }
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

        console.log(`[${new Date().toISOString()}] Processed ${messagesProcessed} messages, elapsedTime: ${elapsedTime}s, remaining: ${formattedRemainingTime}`);
    }
}

//setup
const connectionURL = `amqp://admin:admin@127.0.0.1:5672`;
const amqp = require('amqplib');
let connection = null;
let channel = null;

async function createConnection() {
    if (!connection || !channel) {
        connection = await amqp.connect(connectionURL);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ and channel created.");
    }
}

async function sendMessage(eventName, pair) {
    try {
        await createConnection();  // Ensure connection and channel are established
        const queue = eventName;
        await channel.assertQueue(queue, { durable: true });
        const message = JSON.stringify(pair);
        let status = channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

        return status;
    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}

async function sender() {

    // Use a while loop for sending messages at regular intervals
    while (messagesProcessed < testLimit) {
        try {
            // Pause between sending each message
            await new Promise(resolve => setTimeout(resolve, intervalMs));
            messagesProcessed++;

            const pair = createPair(messagesProcessed);

            // Send individual message
            const messageStatus = await sendMessage(eventName, pair);

            // Calculate processing stats
            calculateProcessing();

            // If the test limit is reached, stop sending messages
            if (messagesProcessed >= testLimit) {
                const elapsedTime = (new Date() - startTime) / 1000; // Elapsed time in seconds
                console.log(`[${new Date().toISOString()}] Done. ${messagesProcessed} messages in ${formatTime(elapsedTime)}.`);

                await channel.close();
                await connection.close();
                process.exit(0); // Exit gracefully after reaching the limit
            }
        } catch (error) {
            console.error("Error in sending message:", error);
            break; // Exit the loop on error
        }
    }
}

async function send() {
    console.log("Start sending messages", startTime);

    const interval = setInterval(async () => {
        try {
            messagesProcessed++;

            const pair = createPair(messagesProcessed);

            const messageStatus = await sender(eventName, pair);

            // Calculate processing stats
            calculateProcessing();

            if (messagesProcessed >= testLimit) {
                clearInterval(interval);
                console.log(`[${new Date().toISOString()}] Done processing ${messagesProcessed} messages in ${formatTime((new Date() - startTime) / 1000)}.`);
              
                process.exit(0);
            }
        } catch (error) {
            console.error("Error in sending message:", error);
        }
    }, intervalMs); // ms

}

send().catch((error) => {
    console.error("Error in sender:", error);
    process.exit(1);
});

// Graceful shutdown on SIGINT
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    try {
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit cleanly on Ctrl+C
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
    console.log("Gracefully shutting down due to SIGTERM...");
    try {
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit cleanly on termination signal
});
