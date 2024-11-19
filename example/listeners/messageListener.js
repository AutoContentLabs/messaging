/**
 * example\listeners\messageListener.js
 */

const { listenMessage } = require("../../src")
listenMessage("event", (pair) => {
    console.log("pair", pair)
})