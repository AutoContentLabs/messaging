// redis/RedisSender.js

const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');

class RedisSender {
    constructor({ eventName = 'test', groupId = 'group.test' }) {
        this.eventName = eventName;
        this.clientId = `sender.${Math.floor(Math.random() * 1000)}`;
        this.groupId = groupId;

        // Redis client configuration
        this.redis = new Redis({
            host: '127.0.0.1',
            port: 6379,
            retryStrategy: (times) => Math.min(times * 50, 2000),
            reconnectOnError: (err) => {
                console.log('Reconnecting to Redis...');
                return true;
            }
        });

        this.redis.on('error', (error) => {
            console.error('Redis connection error:', error);
            process.exit(1);
        });
    }

    // Function to simulate sending a single message
    async sender(pair) {
        const streamName = this.eventName;

        try {
            // Send the message to the Redis stream
            const status = await this.redis.xadd(streamName, '*', 'key', JSON.stringify(pair.key), 'value', JSON.stringify(pair.value), 'headers', JSON.stringify(pair.headers));
            return status;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            return null;
        }
    }

    // Main function to send messages
    async send(pair) {
        console.log("Start sending messages", this.startTime);

        try {

            const messageStatus = await this.sender(pair);

            return messageStatus
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    // Graceful shutdown
    async shutdown() {
        console.log("Gracefully shutting down...");
        try {
            await this.redis.quit();
        } catch (error) {
            console.error("Error during shutdown:", error);
        }
        process.exit(0); // Exit cleanly
    }
}

module.exports = RedisSender