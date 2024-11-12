// tests\index.test.js

require('@dotenvx/dotenvx').config();

const { sendMessage, startListener, topics } = require("../src")
function onMessageCallback(messageString) {
    console.log(messageString)
}
startListener(topics.DATA_COLLECT_REQUEST, onMessageCallback)


sendMessage(topics.DATA_COLLECT_STATUS, { "listener": true })