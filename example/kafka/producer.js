const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'producer.test',
  brokers: ['localhost:9092']
})

const producer = kafka.producer()

async function sendMessages() {
  await producer.connect()

  const startTime = Date.now()
  let messageCount = 0

  const interval = setInterval(async () => {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: `Message ${messageCount}` }],
    })
    messageCount++

    if (messageCount >= 1000000) {
      clearInterval(interval)
      const elapsedTime = (Date.now() - startTime) / 1000
      console.log(`Sent ${messageCount} messages in ${elapsedTime} seconds`)
      await producer.disconnect()
    }
  }, 1)

}

sendMessages().catch(console.error)
