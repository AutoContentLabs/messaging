// redis/RedisSender.js

const { logger } = require("@auto-content-labs/messaging-utils");

const config = require("../config");
const Redis = require("ioredis");

class RedisSender {
  constructor({ eventName }) {
    this.eventName = eventName;
    this.clientId = config.REDIS_CLIENT_ID;
    this.groupId = config.REDIS_GROUP_ID;

    // Redis client configuration
    this.initRedis();
  }

  // Redis start
  initRedis() {
    if (!this.redis) {
      this.redis = new Redis({
        host: config.REDIS_HOST_ADDRESS,
        port: config.REDIS_HOST_PORT,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        reconnectOnError: (err) => {
          logger.info("[RedisSender] Reconnecting to Redis...");
          return true;
        },
        connectTimeout: 10000, // Connection timeout
        socketKeepAlive: true, // Ensure socket keeps the connection alive
      });

      this.redis.on("error", (error) => {
        logger.error("[RedisSender] Redis connection error:", error);
        // Here you might want to implement a more advanced retry strategy or alerting
      });

      // Check Redis connection health periodically (ping)
      setInterval(() => {
        this.redis.ping()
          .then((response) => {
            logger.info("[RedisSender] Redis is alive:", response);
          })
          .catch((error) => {
            logger.error("[RedisSender] Redis ping error:", error);
          });
      }, 60000); // Ping every 60 seconds
    }
  }

  // Redis (batch)
  async sender(pairs) {
    const streamName = this.eventName;

    const pipeline = this.redis.pipeline();
    pairs.forEach((pair) => {
      pipeline.xadd(
        streamName,
        "*",
        "key", JSON.stringify(pair.key),
        "value", JSON.stringify(pair.value),
        "headers", JSON.stringify(pair.headers)
      );
    });

    try {
      const result = await pipeline.exec(); // batch
      logger.info(`[RedisSender] Successfully sent ${pairs.length} messages`);
      return result;
    } catch (error) {
      logger.error("[RedisSender] Error sending messages:", error);
      return null;
    }
  }

  // Single
  async send(pair) {
    try {
      const messageStatus = await this.sender([pair]);
      return messageStatus;
    } catch (error) {
      logger.error("[RedisSender] Error sending message:", error);
      return null;
    }
  }

  // 
  async shutdown() {
    try {
      if (this.redis) {
        logger.info("[RedisSender] Shutting down Redis connection...");
        await this.redis.quit();
      }
    } catch (error) {
      logger.error("[RedisSender] Error during shutdown:", error);
    }
  }

  // Graceful shutdown on process exit
  handleProcessExit() {
    process.on("SIGINT", async () => {
      logger.info("[RedisSender] SIGINT received. Shutting down gracefully...");
      await this.shutdown();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("[RedisSender] SIGTERM received. Shutting down gracefully...");
      await this.shutdown();
      process.exit(0);
    });
  }
}

module.exports = RedisSender;
