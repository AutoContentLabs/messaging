const { sendMessage, sendMessages } = require("../../src");

const startTime = Date.now();
let pairsCount = 0;
let testLimit = 1000000;
// topic = channel = event
const eventName = "test";

const pair = { key: { id: 0 }, value: { content: "Message" } };

async function sendTest() {
    const interval = setInterval(async () => {
        try {
            await sendMessage(eventName, pair); 
            pairsCount++;

            if (pairsCount % 10000 === 0) {
                const elapsedTime = (Date.now() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
            }

            if (pairsCount >= testLimit) {
                clearInterval(interval);
                const elapsedTime = (Date.now() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, 10); 
}

async function sendBatchTest() {
    const pairs = [
        pair,
        pair
    ];

    try {
        await sendMessages(eventName, pairs);
        console.log(`Sent batch of ${pairs.length} messages`);
    } catch (error) {
        console.error("Error sending batch of messages:", error);
    }
}

sendTest().catch(console.error);
