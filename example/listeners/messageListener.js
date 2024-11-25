/**
 * example\listeners\messageListener.js
 */

const { listenMessage } = require("../../src")
listenMessage("test", (pair) => {
    console.log(pair.event, pair)
})