// src/transports/topics.js

// Determine the environment for topic differentiation (default to "development" if not set)
const environment = process.env.NODE_ENV || "development";

// Common base topics shared across all environments
const commonTopics = {
  DATA_COLLECT_REQUEST: process.env.KAFKA_TOPIC_DATA_COLLECT_REQUEST || "data_collector.collect.request",
  DATA_COLLECT_STATUS: process.env.KAFKA_TOPIC_DATA_COLLECT_STATUS || "data_collector.collect.status",
  JOB_SCHEDULE: process.env.KAFKA_TOPIC_JOB_SCHEDULE || "job_scheduler.schedule.create",
  JOB_STATUS: process.env.KAFKA_TOPIC_JOB_STATUS || "job_scheduler.schedule.status",
};

// Function to append environment suffix to topic names
const appendEnvironment = (topic) => `${topic}.${environment}`;

module.exports = {
  DATA_COLLECT_REQUEST: appendEnvironment(commonTopics.DATA_COLLECT_REQUEST),
  DATA_COLLECT_STATUS: appendEnvironment(commonTopics.DATA_COLLECT_STATUS),
  JOB_SCHEDULE: appendEnvironment(commonTopics.JOB_SCHEDULE),
  JOB_STATUS: appendEnvironment(commonTopics.JOB_STATUS),
};
