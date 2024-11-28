const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { trace, context, SpanKind } = require('@opentelemetry/api');
const config = require('../transporters/config');

class Telemetry {
  constructor() {
    const serviceName = `${config.GROUP_ID}-${config.MESSAGE_SYSTEM}`;

    // Zipkin Exporter
    this.zipkinExporter = new ZipkinExporter({
      url: `http://${config.ZIPKIN_HOST_ADDRESS}:${config.ZIPKIN_HOST_PORT}/api/v2/spans`, 
    });

    // Jaeger Exporter
    this.jeagerExporter = new JaegerExporter({
      endpoint: `http://${config.JAEGER_HOST_ADDRESS}:${config.JAEGER_HTTP_PORT}/api/traces`, 
    });

    // Tracer Provider
    this.provider = new NodeTracerProvider({
      resource: new Resource({
        'service.name': serviceName,
      }),
    });

    // Add Zipkin and Jaeger span processors
    this.provider.addSpanProcessor(new SimpleSpanProcessor(this.zipkinExporter))
    this.provider.addSpanProcessor(new SimpleSpanProcessor(this.jeagerExporter));

    // Register the provider
    this.provider.register();

    // Get the tracer
    this.tracer = trace.getTracer(serviceName);
  }

  getTracer() {
    return this.tracer;
  }

  startSpan(name, options, context) {
    return this.tracer.startSpan(name, options, context);
  }

  start(spanName, eventName, pair) {
    const spanContext = {
      traceId: pair.headers.traceId,  // Your custom traceId (16 bytes)
      spanId: pair.key.recordId,      // Your custom spanId (8 bytes)
      traceFlags: 1,                  // Trace flags (default 'sampled')
      parentId: undefined,            // No parent span for root span
    };

    const options = {
      kind: SpanKind.INTERNAL,
      attributes: {
        'messageSystem': config.MESSAGE_SYSTEM,
        'groupId': config.GROUP_ID,
        'clientId': config.CLIENT_ID,
        'eventName': eventName,
        ...this.convertModelToTags(pair)
      }
    };

    const currentContext = context.active() || context.setSpan(context.active(), spanContext);

    // Start span with the custom context containing your traceId and spanId
    const span = this.startSpan(spanName, options, currentContext);

    // Explicitly set traceId and spanId as attributes
    span.setAttribute('traceId', spanContext.traceId);
    span.setAttribute('spanId', spanContext.spanId);

    return span;
  }

  convertModelToTags(model) {
    const tags = {};
    for (const [key, value] of Object.entries(model)) {
      if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          tags[`model.${key}.${subKey}`] = subValue;
        }
      } else {
        tags[`model.${key}`] = value;
      }
    }
    return tags;
  }
}

module.exports = new Telemetry();
