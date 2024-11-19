/**
 * example\sendAlert.js
 */

const { sendAlert } = require("../src/senders/alertSender");

(async () => {
    try {
        await sendAlert({ content: "This is example alert!", level: "crit", timestamp: new Date().toISOString() });
    } catch (error) {
        console.error("Failed to send alert:", error.message);
    }
})();