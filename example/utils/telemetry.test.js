const { telemetry, helper } = require("../../src");

const eventName = "test";
const id = helper.generateId(8); // Özel spanId oluşturuyoruz
const model = {
    content: "Critical system failure detected.",
    level: "emerg",
    timestamp: new Date().toISOString()
};

function createPair(eventName, id, model) {
    const pair = {
        event: eventName,
        key: { recordId: id },
        value: model,
        headers: helper.generateHeaders("")
    };

    return pair;
}

const spanName = "test-span";
const span = telemetry.start(spanName, eventName, createPair(eventName, id, model));
span.end();
