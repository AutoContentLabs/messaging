const amqp = require('amqplib');

const queue = 'test';
const consumerGroup = 'group.test'; // no
const consumerName = `consumer-${Math.floor(Math.random() * 1000)}`;
const testLimit = 1000000;
const processLimit = 1000;

console.log(`listener queue: ${queue} consumerGroup: ${consumerGroup} consumerName: ${consumerName}`);

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

async function listen() {
    const connection = await amqp.connect('amqp://admin:admin@127.0.0.1:5672');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

    let messagesProcessed = 0;
    const startTime = new Date();

    let totalProcessingTime = 0;

    console.log(`[${consumerName}] is waiting for messages...`);

    channel.consume(queue, async (msg) => {
        const startLoopTime = new Date();
        if (msg !== null) {
            const message = JSON.parse(msg.content.toString());

            const { key, value, headers } = message
            
            channel.ack(msg);
            messagesProcessed++;


            const loopTime = (new Date() - startLoopTime) / 1000;
            totalProcessingTime += loopTime;


            if (messagesProcessed % processLimit === 0) {
                const elapsedTime = (new Date() - startTime) / 1000;
                console.log(`[${consumerName}] Processed ${messagesProcessed} messages in ${elapsedTime} seconds`);


                const averageProcessingTime = totalProcessingTime / messagesProcessed;


                const remainingMessages = testLimit - messagesProcessed;
                const estimatedRemainingTime = averageProcessingTime * remainingMessages; // in seconds

                const formattedRemainingTime = formatTime(estimatedRemainingTime);

                console.log(`[${consumerName}] Estimated remaining time: ${formattedRemainingTime}`);
            }
        }

        if (messagesProcessed >= testLimit) {
            console.log(`[${consumerName}] Reached test limit, shutting down...`);
            await channel.close();
            await connection.close();
            process.exit(0);
        }
    });
}

listen().catch(console.error);

process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    process.exit(0);
});
