// rabbitmq/RabbitMQSender.js

const { logger } = require("@auto-content-labs/messaging-utils");

const amqp = require('amqplib');
const config = require("../config");

class RabbitMQSender {
    constructor({ eventName }) {
        this.eventName = eventName;
        this.clientId = config.RABBITMQ_CLIENT_ID;
        this.groupId = config.RABBITMQ_GROUP_ID;

        // Connection and channel will be initialized later
        this.connection = null;
        this.channel = null;
        this.queue = null;
    }

    // Create the connection and channel to RabbitMQ (only once)
    async createConnection() {
        if (!this.connection || !this.channel) {
            const connectionURL = `amqp://${config.RABBITMQ_DEAULT_USER}:${config.RABBITMQ_DEFAULT_PASSWORD}@${config.RABBITMQ_HOST_ADDRESS}:${config.RABBITMQ_HOST_PORT}`;
            this.connection = await amqp.connect(connectionURL);
            this.channel = await this.connection.createChannel();

            logger.info("[RabbitMQSender] Connected to RabbitMQ and channel created.");

            // Ensure queue is created once
            this.queue = this.eventName;  // The event name represents the queue
            await this.channel.assertQueue(this.queue, { durable: true });
            logger.info(`[RabbitMQSender] Queue "${this.queue}" is ensured to exist.`);
        }
    }

    // Send a single message to the queue
    async sendMessage(pair) {
        try {
            await this.createConnection();  // Ensure connection and channel are established
            const message = JSON.stringify(pair);
            const status = this.channel.sendToQueue(this.queue, Buffer.from(message), { persistent: true });
            return status;
        } catch (error) {
            logger.error("[RabbitMQSender] Error sending message:", error);
            return false;
        }
    }

    // Send multiple messages to the queue in parallel (but with limited concurrency)
    async sendMessages(pairs) {
        try {
            await this.createConnection();  // Ensure connection and channel are established

            const concurrencyLimit = 10;  // Limit the number of concurrent messages being sent at once
            const statusPromises = [];

            for (let i = 0; i < pairs.length; i++) {
                statusPromises.push(this.sendMessage(pairs[i]));  // Push the send message promise to the array

                // If the concurrency limit is reached, wait for the promises to resolve before continuing
                if (statusPromises.length >= concurrencyLimit) {
                    await Promise.all(statusPromises);
                    statusPromises.length = 0;  // Clear the statusPromises array
                }
            }

            // Ensure remaining messages are sent if any
            if (statusPromises.length > 0) {
                await Promise.all(statusPromises);
            }

        } catch (error) {
            logger.error("[RabbitMQSender] Error sending multiple messages:", error);
        }
    }

    // Graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
    async shutdown() {
        logger.info("[RabbitMQSender] Gracefully shutting down...");
        try {
            await this.channel.close();
            await this.connection.close();
        } catch (error) {
            logger.error("[RabbitMQSender] Error during shutdown:", error);
        }

        process.exit(0); // Exit cleanly on shutdown
    }
}

// Exporting the sender class for external use
module.exports = RabbitMQSender;
