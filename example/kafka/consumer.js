const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'consumer.test',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group' })

async function consumeMessages() {
  await consumer.connect()

  await consumer.subscribe({ topic: 'test', fromBeginning: true })

  let messageCount = 0
  const startTime = Date.now()

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      messageCount++
      if (messageCount % 10000 === 0) {
        const elapsedTime = (Date.now() - startTime) / 1000
        console.log(`Consumed ${messageCount} messages in ${elapsedTime} seconds`)
      }

      if (messageCount >= 1000000) {
        await consumer.disconnect()
        console.log / "done"
      }
    },
  })
}

consumeMessages().catch(console.error)
