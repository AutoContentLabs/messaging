const { listenMessage } = require("../src/index")

const { handleMessage } = require("../src/handlers/messageHandler")

listenMessage("test", handleMessage)