/**
 * example\sendAlert.js
 */

const { sendAlertRequest } = require("../src/senders/alertSender");

(async () => {
    try {
        await sendAlertRequest({ content: "This is example alert!", level: "crit", timestamp: new Date().toISOString() });
    } catch (error) {
        console.error("Failed to send alert:", error.message);
    }
})();