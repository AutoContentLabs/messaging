// rabbitmq/RabbitMQListener.js
const amqp = require('amqplib');
const config = require("../config");

class RabbitMQListener {
    constructor({ eventName = 'test' }) {
        this.eventName = eventName;
        this.clientId = config.RABBITMQ_CLIENT_ID;
        this.groupId = config.RABBITMQ_GROUP_ID;

        // Connection and channel will be initialized later
        this.connection = null;
        this.channel = null;
    }

    // Create the connection and channel to RabbitMQ
    async createConnection() {
        const connectionURL = `amqp://${config.RABBITMQ_DEAULT_USER}:${config.RABBITMQ_DEFAULT_PASSWORD}@${config.RABBITMQ_HOST_ADDRESS}:${config.RABBITMQ_HOST_PORT}`;
        this.connection = await amqp.connect(connectionURL);
        this.channel = await this.connection.createChannel();
    }

    // Start listening for messages
    async listener(callback) {
        const queue = this.eventName;

        try {
            await this.createConnection();
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.prefetch(1); // Process one message at a time
        } catch (error) {
            console.error("Error asserting queue:", error);
            return; // Skip processing if queue assertion fails
        }

        console.log(`[${this.clientId}] is waiting for messages...`);

        // Handle messages as they arrive
        this.channel.consume(queue, async (msg) => {

            if (msg !== null) {
                try {
                    const message = JSON.parse(msg.content.toString());
                    const { key, value, headers } = message;

                    await callback({ event: queue, key, value, headers });

                    // Acknowledge the message after processing
                    this.channel.ack(msg);
                } catch (err) {
                    console.error("Error parsing message:", err);
                    return; // Skip processing this message if parsing fails
                }
            }

        });
    }

    // Start listening and processing messages
    async start(handler) {
        console.log("Starting listener...");

        await this.listener(async ({ event, key, value, headers }) => {
            this.messagesProcessed++;
            await handler({ event, key, value, headers });
        });
    }

    // Graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
    async shutdown() {
        console.log("Gracefully shutting down...");

        await this.channel.close();
        await this.connection.close();
        process.exit(0);
    }
}

// Exporting the listener class for external use
module.exports = RabbitMQListener;
