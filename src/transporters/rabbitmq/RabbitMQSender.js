// rabbitmq/RabbitMQSender.js

const amqp = require('amqplib');
const config = require("../config");

class RabbitMQSender {
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
        if (!this.connection || !this.channel) {
            const connectionURL = `amqp://${config.RABBITMQ_DEAULT_USER}:${config.RABBITMQ_DEFAULT_PASSWORD}@${config.RABBITMQ_HOST_ADDRESS}:${config.RABBITMQ_HOST_PORT}`;
            this.connection = await amqp.connect(connectionURL);
            this.channel = await this.connection.createChannel();
            console.log("Connected to RabbitMQ and channel created.");
        }
    }

    // Send a message to the queue
    async sendMessage(pair) {
        try {
            await this.createConnection();  // Ensure connection and channel are established
            const queue = this.eventName;
            await this.channel.assertQueue(queue, { durable: true });
            const message = JSON.stringify(pair);
            let status = this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

            return status;
        } catch (error) {
            console.error("Error sending message:", error);
            return false;
        }
    }

    // Send multiple messages to the queue
    async sendMessages(pairs) {
        for (let pair of pairs) {
            const status = await this.sendMessage(pair);  // Ensure messages are sent sequentially
            if (!status) {
                console.error("Failed to send message:", pair);
            }
        }
    }

    // Graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
    async shutdown() {
        console.log("Gracefully shutting down...");

        try {
            await this.channel.close();
            await this.connection.close();
        } catch (error) {
            console.error("Error during shutdown:", error);
        }

        process.exit(0); // Exit cleanly on shutdown
    }
}

// Exporting the sender class for external use
module.exports = RabbitMQSender;
