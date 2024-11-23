// redis/RedisSender.js
const config = require("../config")
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');

class RedisSender {
    constructor({ eventName = 'test' }) {
        this.eventName = eventName;
        this.clientId = config.REDIS_CLIENT_ID;
        this.groupId = config.REDIS_GROUP_ID;

        // Redis client configuration
        if (!this.redis) {

            this.redis = new Redis({
                host: config.REDIS_HOST_ADDRESS,
                port: config.REDIS_HOST_PORT,
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

        try {

            const messageStatus = await this.sender(pair);

            return messageStatus
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            this.shutdown()
        }
    }

    // Graceful shutdown
    async shutdown() {

        try {
            await this.redis.quit();
        } catch (error) {
            console.error("Error during shutdown:", error);
        }

    }
}

module.exports = RedisSender