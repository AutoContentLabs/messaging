const logger = require("../utils/logger");
const { validateData } = require("../utils/validator");
const { sendMessage } = require("../senders/messageSender");
const { generateHeaders, generateKey } = require("../utils/helper");
const config = require("../transporters/config");

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

const serviceName = `${config.CLIENT_ID}-${config.MESSAGE_SYSTEM}`;
const exporter = new ZipkinExporter({
  serviceName: serviceName,
  url: 'http://zipkin:9411/api/v2/spans',
  headers: {},
});

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
  }),
  spanProcessors: [new SimpleSpanProcessor(exporter)]
});

// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
provider.register();


class Model {
  constructor(schemaType, eventName) {
    this.tracer = opentelemetry.trace.getTracer('model');
    this.schemaType = schemaType;
    this.eventName = eventName;
    logger.debug(`[Model] created schemaType: ${schemaType} eventName ${eventName}`, { schemaType, eventName });
  }

  async send(model, correlationId) {
    logger.debug(`[Model] [send] Raw ${JSON.stringify(model)}`);
    try {
      if (!model || typeof model !== "object") {
        throw new Error("No valid data provided for sending.");
      }

      const validationErrors = validateData(this.schemaType, model);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      const key = generateKey();

      // create headers
      const headers = generateHeaders(this.schemaType, correlationId);

      // Start Trace (Span)
      const span = this.tracer.startSpan('send_message', {
        attributes: {
          'correlationId': headers.correlationId,
          'traceId': headers.traceId,
          'serviceId': config.CLIENT_ID,
          'type': headers.type,
          'event': this.eventName,
          'messageSystem': config.MESSAGE_SYSTEM,
          'model': model
        },
      });

      logger.info(`[Model] Sending model to event "${this.eventName}".`, { key, model });

      const pair = { key, value: model, headers };

      // send message
      await sendMessage(this.eventName, pair);

      logger.info(`[Model] Successfully sent model to event "${this.eventName}".`);

      // Finish the span
      span.end();
    } catch (error) {
      logger.error(`[Model] Failed to send model: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Model;
