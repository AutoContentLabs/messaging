/**
 * example\listeners\dataCollectRequestListener.js
 */

const { listenDataCollectRequest, eventHub, events } = require("../../src")
listenDataCollectRequest()

// eventHub.on(events.dataCollectRequest, (processedData) => {
//     console.log("processedData.value", processedData.value)
// })