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
}

module.exports = new Telemetry();
