// src/transports/topics.js

const environment = process.env.NODE_ENV || "development";

const commonTopics = {
  DATA_COLLECT_REQUEST: process.env.KAFKA_TOPIC_DATA_COLLECT_REQUEST || "data_collector.collect.request",
  DATA_COLLECT_STATUS: process.env.KAFKA_TOPIC_DATA_COLLECT_STATUS || "data_collector.collect.status",
  JOB_SCHEDULE: process.env.KAFKA_TOPIC_JOB_SCHEDULE || "job_scheduler.schedule.create",
  JOB_STATUS: process.env.KAFKA_TOPIC_JOB_STATUS || "job_scheduler.schedule.status",
};

module.exports = {
  DATA_COLLECT_REQUEST: `${commonTopics.DATA_COLLECT_REQUEST}.${environment}`,
  DATA_COLLECT_STATUS: `${commonTopics.DATA_COLLECT_STATUS}.${environment}`,
  JOB_SCHEDULE: `${commonTopics.JOB_SCHEDULE}.${environment}`,
  JOB_STATUS: `${commonTopics.JOB_STATUS}.${environment}`,
};
