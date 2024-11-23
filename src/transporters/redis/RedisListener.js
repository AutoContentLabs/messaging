// redis/RedisListener.js
const config = require("../config")
const Redis = require('ioredis');

class RedisListener {
    constructor({ eventName = 'test' }) {
        this.eventName = eventName;
        this.clientId = config.REDIS_CLIENT_ID;
        this.groupId = config.REDIS_GROUP_ID;

        // Redis client configuration
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

    // Setup the consumer group if it doesn't already exist
    async createConsumerGroupIfNeeded() {
        try {
            await this.redis.xgroup('CREATE', this.eventName, this.groupId, '$', 'MKSTREAM');
        } catch (error) {
            if (error.message.includes('BUSYGROUP')) {
                console.log(`Consumer group ${this.groupId} already exists`);
            } else {
                console.error('Error creating consumer group:', error);
            }
        }
    }

    // Main function to start listening to the Redis stream
    async listener(callback) {
        await this.createConsumerGroupIfNeeded();

        while (true) {

            try {
                const result = await this.redis.xreadgroup('GROUP', this.groupId, this.clientId, 'BLOCK', 0, 'COUNT', 10, 'STREAMS', this.eventName, '>');

                if (result && result.length > 0) {
                    for (const [stream, messages] of result) {
                        for (const [id, fields] of messages) {
                            try {
                                const message = {
                                    key: JSON.parse(fields[1]),  // JSON key
                                    value: JSON.parse(fields[3]),  // JSON value
                                    headers: JSON.parse(fields[5])  // JSON headers
                                };

                                await callback({ event: this.eventName, key: message.key, value: message.value, headers: message.headers });
                                await this.redis.xack(this.eventName, this.groupId, id);

                            } catch (err) {
                                console.error("Error processing message:", err);
                                continue;
                            }
                        }
                    }
                }

            } catch (err) {
                console.error("Error reading from stream:", err);
                continue;
            }
        }
    }

    // Start the listener and process messages
    async start(handler) {
        console.log("Starting the listener process...");
        await this.listener(async ({ event, key, value, headers }) => {
            await handler({ event, key, value, headers });
        });
    }

    // Graceful shutdown
    async shutdown() {
        console.log("Gracefully shutting down...");
        await this.redis.quit();
        process.exit(0);
    }
}

module.exports = RedisListener
