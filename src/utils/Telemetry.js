const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { trace } = require('@opentelemetry/api');
const config = require('../transporters/config');

class Telemetry {
  constructor() {
    const serviceName = `${config.GROUP_ID}-${config.MESSAGE_SYSTEM}`;
    
    // Zipkin Exporter
    this.zipkinExporter = new ZipkinExporter({
      serviceName,
      url: 'http://zipkin:9411/api/v2/spans',  // Zipkin URL
    });

    // Jaeger Exporter
    this.jaegerExporter = new JaegerExporter({
      serviceName,
      endpoint: 'http://jaeger:5775/api/traces',  // Jaeger endpoint
    });

    // Tracer Provider
    this.provider = new NodeTracerProvider({
      resource: new Resource({
        'service.name': serviceName,
      }),
    });

    // Add both Zipkin and Jaeger span processors
    this.provider.addSpanProcessor(new SimpleSpanProcessor(this.zipkinExporter));
    this.provider.addSpanProcessor(new SimpleSpanProcessor(this.jaegerExporter));

    // Register the provider
    this.provider.register();

    // Get the tracer
    this.tracer = trace.getTracer(serviceName);
  }

  getTracer() {
    return this.tracer;
  }

  /**
   * Converts a model object to Zipkin-compatible tags dynamically.
   * @param {Object} model - The model object containing dynamic data.
   * @returns {Object} - A set of tags that can be added to the Zipkin span.
   */
  convertModelToTags(model) {
    const tags = {};

    // Loop through each key-value pair in the model and add it as a tag
    for (const [key, value] of Object.entries(model)) {
      if (typeof value === 'object' && value !== null) {
        // If the value is an object, we can flatten it
        for (const [subKey, subValue] of Object.entries(value)) {
          tags[`model.${key}.${subKey}`] = subValue;
        }
      } else {
        // Otherwise, add it as a direct tag
        tags[`model.${key}`] = value;
      }
    }

    return tags;
  }
}

module.exports = new Telemetry();
