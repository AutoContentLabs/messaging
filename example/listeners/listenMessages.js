const { listenMessage } = require("../../src")

// topic = channel = event
const eventName = "test";

let testLimit = 1000000
let pairCount = 0
const startTime = Date.now()

async function listen() {
    await listenMessage(eventName, async ({ key, value }) => {

        pairCount++
        if (pairCount % 10000 === 0) {
            const elapsedTime = (Date.now() - startTime) / 1000
            console.log(`Consumed ${messageCount} pairs in ${elapsedTime} seconds`)
        }

        if (messageCount >= testLimit) {
            console.log("done")
        }
    });
}

listen().catch(console.error)
