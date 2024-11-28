// mock
process.env.ZIPKIN_HOST_ADDRESS = "localhost"
process.env.ZIPKIN_HOST_PORT = "3000"

process.env.JAEGER_HOST_ADDRESS = "localhost"
process.env.JAEGER_HTTP_PORT = "3000"

const { telemetry, helper } = require("../../src");

const eventName = "test";
const id = helper.generateId(8); //  spanId
const model = {
    id: "test-1",
    source: "test",
    params: { url: "example.com" },
    priority: "high",
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
