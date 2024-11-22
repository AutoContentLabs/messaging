const { listenMessage } = require("../../src")

// topic = channel = event
const eventName = "test";

let testLimit = 1000000
let pairCount = 0
const startTime = Date.now()

async function listen() {
    console.log("start test", startTime)

    await listenMessage(eventName, async ({ key, value }) => {
        pairCount++

        if (pairCount % 10000 === 0) {
            const elapsedTime = (Date.now() - startTime) / 1000
            console.log(`Consumed ${pairCount} pairs in ${elapsedTime} seconds`)
        }

        if (pairCount >= testLimit) {
            console.log("done")
            process.exit(0) 
        }
    });
}

listen().catch(console.error)
