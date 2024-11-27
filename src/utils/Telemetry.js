const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { trace } = require('@opentelemetry/api');
const config = require('../transporters/config');

class Telemetry {
  constructor() {
    const serviceName = `${config.GROUP_ID}-${config.MESSAGE_SYSTEM}`;
    this.exporter = new ZipkinExporter({
      serviceName,
      url: 'http://zipkin:9411/api/v2/spans',
    });

    this.provider = new NodeTracerProvider({
      resource: new Resource({
        'service.name': serviceName,
      }),
    });

    this.provider.addSpanProcessor(new SimpleSpanProcessor(this.exporter));
    this.provider.register();
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
