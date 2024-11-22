const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'consumer.test',
  brokers: ['localhost:9092'],
  logLevel: 0
})

const consumer = kafka.consumer({ groupId: 'test' })
const eventName = "test"
const testLimit = 100000

async function consumeMessages() {
  try {
    await consumer.connect()
    await consumer.subscribe({ topic: eventName, fromBeginning: true })

    let messageCount = 0
    const startTime = new Date()
    console.log("start test", startTime)

    await consumer.run({
      eachMessage: async ({ message }) => {
        // Access the message's key and value directly
        const key = message.key ? JSON.parse(message.key.toString()) : null;
        const value = JSON.parse(message.value.toString()) // Parsing value (like { content: "Message" })
        
        messageCount++

        if (messageCount % 10000 === 0) {
          const elapsedTime = (Date.now() - startTime) / 1000
          console.log(`Consumed ${messageCount} messages in ${elapsedTime} seconds`)
        }

        if (messageCount >= testLimit) {
          console.log(`Consumed ${messageCount} messages, test completed.`)
          await consumer.disconnect()
          console.log("Consumer disconnected successfully.")
        }
      },
    })
  } catch (error) {
    console.error("Error in consumer:", error)
    try {
      await consumer.disconnect() 
    } catch (disconnectError) {
      console.error("Error during consumer disconnect:", disconnectError)
    }
  }
}

// Handle graceful shutdown (e.g., Ctrl+C)
process.on('SIGINT', async () => {
  console.log("Gracefully shutting down consumer...")
  try {
    await consumer.disconnect()
    console.log("Consumer disconnected successfully.")
  } catch (error) {
    console.error("Error during graceful shutdown:", error)
  } finally {
    process.exit(0)
  }
})

consumeMessages().catch(console.error)
