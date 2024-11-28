// src\utils\Telemetry.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http'); // OTLP Exporter
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');  // Zipkin Exporter
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger'); // @deprecated

const { trace, context, SpanKind, SpanOptions } = require('@opentelemetry/api');
const config = require('../transporters/config');

class Telemetry {
  constructor() {
    const serviceName = `${config.GROUP_ID}-${config.MESSAGE_SYSTEM}`;

    // Zipkin Exporter
    this.zipkinExporter = new ZipkinExporter({
      url: `http://${config.ZIPKIN_HOST_ADDRESS}:${config.ZIPKIN_HOST_PORT}/api/v2/spans`,  // Zipkin HTTP endpoint
    });

    // Jaeger Exporter
    this.jeagerExporter = new JaegerExporter({
      endpoint: `http://${config.JAEGER_HOST_ADDRESS}:${config.JAEGER_HTTP_PORT}/api/traces`,  // Zipkin HTTP endpoint
    });

    // Tracer Provider
    this.provider = new NodeTracerProvider({
      resource: new Resource({
        'service.name': serviceName,
      }),
    });

    // Add OTLP and Zipkin span processors
    this.provider
      // @deprecated
      // please use TracerConfig spanProcessors property Adds a new SpanProcessor to this tracer.
      .addSpanProcessor(new SimpleSpanProcessor(this.zipkinExporter));  // For Zipkin
    this.provider
      // @deprecated
      // please use TracerConfig spanProcessors property Adds a new SpanProcessor to this tracer
      .addSpanProcessor(new SimpleSpanProcessor(this.jeagerExporter));  // For Jaeger

    // Register the provider
    this.provider.register();

    // Get the tracer
    this.tracer = trace.getTracer(serviceName);
  }

  getTracer() {
    return this.tracer;
  }

  startSpan(name, options, context) {

    return this.tracer.startSpan(name, options, context)
  }

  start(spanName, eventName, pair) {
    const spanContext = {
      // Use the traceId from the pair headers
      traceId: pair.headers.traceId, // 16-byte string hex (from your custom ID generator)
      spanId: pair.key.recordId,     // 8-byte string hex (from your custom ID generator)
      traceFlags: 1,                 // default trace flags (can be adjusted)
      parentId: undefined,           // Set to `undefined` for a root span (can be set if there's a parent span)
    };

    console.log("myContext", spanContext)
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

    console.log("myOptions", options)

    // Use the active context or create a new one with the spanContext.
    const currentContext = context.active() || context.setSpan(context.active(), spanContext); // Ensure valid context

    // Start the span with the provided context.
    const span = this.startSpan(spanName, options, currentContext);

    // Explicitly set the traceId and spanId to ensure they are correctly included in the span
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
