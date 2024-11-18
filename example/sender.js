const { sendMessage } = require("../src/index")

const pair = {
    key: {
        id: 1,
        name: "log"
    },
    value: {
        level: "debug",
        message: "Logs is ready"
    }
}

sendMessage("test", pair)
