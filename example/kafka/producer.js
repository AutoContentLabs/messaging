const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'producer.test',
  brokers: ['localhost:9092'],
  logLevel: 0
})

const producer = kafka.producer()

const eventName = "test"
const testLimit = 100000
const pair = { key: { id: 0 }, value: { content: "Message" } };

async function sendMessages() {
  try {
    await producer.connect()

    const startTime = new Date()
    let messageCount = 0

    console.log("start test", startTime)

    async function sendBatch() {
      try {
        const messages = []

        for (let i = 0; i < 100; i++) {
          // Serialize the pair object to a string before sending
          messages.push({
            value: JSON.stringify(pair.key),  // Ensure the pair is converted to a string
            key: JSON.stringify(pair.value)  // Ensure the pair is converted to a string
          })
          messageCount++
        }

        await producer.send({
          topic: eventName,
          messages,
        })

        if (messageCount % 10000 === 0) {
          const elapsedTime = (Date.now() - startTime) / 1000
          console.log(`Produced ${messageCount} messages in ${elapsedTime} seconds`)
        }

        if (messageCount < testLimit) {
          setTimeout(sendBatch, 50); // Send next batch after 50ms
        } else {
          const elapsedTime = (Date.now() - startTime) / 1000
          console.log(`Sent ${messageCount} messages in ${elapsedTime} seconds`)
          await producer.disconnect()
        }
      } catch (error) {
        console.error("Error sending messages:", error)
      }
    }

    sendBatch()  // Start the first batch

  } catch (error) {
    console.error("Error connecting to Kafka producer:", error)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log("Gracefully shutting down...")
  await producer.disconnect()
  process.exit(0)
})

sendMessages().catch(console.error)
