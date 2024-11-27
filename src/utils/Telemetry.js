// src\utils\Telemetry.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http'); // OTLP Exporter
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');  // Zipkin Exporter
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger'); // @deprecated

const { trace } = require('@opentelemetry/api');
const config = require('../transporters/config');

class Telemetry {
  constructor() {
    const serviceName = `${config.GROUP_ID}-${config.MESSAGE_SYSTEM}`;

    // Zipkin Exporter
    this.zipkinExporter = new ZipkinExporter({
      url: `http://${config.ZIPKIN_HOST_ADDRESS}:${config.ZIPKIN_HOST_PORT}/api/v2/spans`,  // Zipkin HTTP endpoint
    });

    // OTLP Exporter for Jaeger
    // 4318	HTTP	/v1/traces
    // 9412	HTTP	/api/v1/spans
    // 9412	HTT	/api/v2/spans
    // 14268	HTTP	/api/traces
    // 5778	HTTP	/sampling
    this.otlpExporter = new OTLPTraceExporter({
      url: `http://${config.JAEGER_HOST_ADDRESS}:${config.JAEGER_HOST_PORT}/v1/traces`,
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
      .addSpanProcessor(new SimpleSpanProcessor(this.otlpExporter));  // For Jaeger

    // Register the provider
    this.provider.register();

    // Get the tracer
    this.tracer = trace.getTracer(serviceName);
  }

  getTracer() {
    return this.tracer;
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
