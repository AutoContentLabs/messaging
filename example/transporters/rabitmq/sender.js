const amqp = require('amqplib');

const queue = 'test';
let messageId = 0;
const testLimit = 1000000;
const processLimit = 1000;
const pair = {
    key: { id: 0 },
    value: {
        content: "Message"
    },
    headers: {
        correlationId: new Date().toISOString()
    }
};


function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let timeString = '';
    if (days > 0) timeString += `${days} day(s) `;
    if (hours > 0) timeString += `${hours} hour(s) `;
    if (minutes > 0) timeString += `${minutes} minute(s) `;
    if (secs > 0) timeString += `${secs} second(s)`;

    return timeString.trim();
}

async function sendMessage(channel) {
    const message = JSON.stringify(pair);
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
}

async function sendTest() {
    const connection = await amqp.connect('amqp://admin:admin@127.0.0.1:5672');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    let pairsCount = 0;
    const startTime = new Date();
    let previousTime = startTime;

    console.log("Start sending messages", startTime);

    const interval = setInterval(async () => {
        try {
            await sendMessage(channel);
            pairsCount++;
            pair.key.id = pairsCount;


            if (pairsCount % processLimit === 0) {
                const elapsedTime = (new Date() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);


                const averageTimePerMessage = elapsedTime / pairsCount;


                const remainingMessages = testLimit - pairsCount;
                const estimatedRemainingTime = averageTimePerMessage * remainingMessages;


                const formattedRemainingTime = formatTime(estimatedRemainingTime);
                console.log(`Estimated remaining time: ${formattedRemainingTime}`);
            }


            if (pairsCount >= testLimit) {
                clearInterval(interval);
                const elapsedTime = (new Date() - startTime) / 1000;
                console.log(`Sent ${pairsCount} messages in ${elapsedTime} seconds`);
                await channel.close();
                await connection.close();
                process.exit(0);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, 10); //  10ms

}


sendTest().catch(console.error);

process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    process.exit(0);
});
