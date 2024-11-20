const { sendDataCollectRequestRequest } = require("../../src/senders/dataCollectRequestSender");

setInterval(async () => {
    try {
        await sendDataCollectRequestRequest({
            id: "request12345",
            source: "Google Trends",
            params: {
                category: "trend",
                region: "TR",
                url: "https://trends.google.com/trending/rss?geo=TR"
            },
            priority: "high",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed:", error.message);
    }
}, 60000); 
