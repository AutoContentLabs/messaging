const { sendMessage, sendMessages } = require("../../src");

const startTime = Date.now()
let pairsCount = 0
let testLimit = 1000000
// topic = channel = event
const eventName = "test";

async function sendTest() {
    const interval = setInterval(async () => {

        const pair = { key: { id: 0 }, value: { content: "Message" } }
        sendMessage(eventName, pair)
        pairsCount++

        if (pairsCount >= testLimit) {
            clearInterval(interval)
            const elapsedTime = (Date.now() - startTime) / 1000
            console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`)
        }
    }, 1)
}

async function sendBatchTest() {
    const pairs = [
        pair,
        pair
    ];
    sendMessages(eventName, pairs)
}

sendTest().catch(console.error)


