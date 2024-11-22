const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'producer.test',
  brokers: ['localhost:9092'],
  logLevel: 0
})

const producer = kafka.producer()

const eventName = "test"
const testLimit = 1000000

async function sendMessages() {
  try {
    await producer.connect()

    const startTime = new Date()
    let messageCount = 0

    console.log("start test", startTime)

    const interval = setInterval(async () => {
      try {
        const messages = []

        for (let i = 0; i < 100; i++) {
          messages.push({ value: `Message ${messageCount}` })
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

        if (messageCount >= testLimit) {
          clearInterval(interval)
          const elapsedTime = (Date.now() - startTime) / 1000
          console.log(`Sent ${messageCount} messages in ${elapsedTime} seconds`)
          await producer.disconnect()
        }
      } catch (error) {
        console.error("Error sending messages:", error)
      }
    }, 50)

  } catch (error) {
    console.error("Error connecting to Kafka producer:", error)
  }
}

sendMessages().catch(console.error)
