// src/topics.js

// Get the current environment or default to "development" if undefined
const environment = process.env.NODE_ENV || "development";

/**
 * Generates a topic name based on a base name and current environment.
 * 
 * @param {string} baseName - Base name for the topic.
 * @returns {string} - Complete topic name considering environment and custom configurations.
 */
const createTopicName = (baseName) => {
  return process.env[`MESSAGING_TOPIC_${baseName.toUpperCase()}`] || `${baseName}.${environment}`;
};

/**
 * Define common topics with environment-based names.
 * Each topic can be customized via environment variables to support flexibility across deployments.
 */
const topics = {
  // Data collection related topics
  dataCollectRequest: createTopicName("DATA_COLLECT_REQUEST"),
  dataCollectStatus: createTopicName("DATA_COLLECT_STATUS"),
  dataCollectResponse: createTopicName("DATA_COLLECT_RESPONSE"),
  dataCollectError: createTopicName("DATA_COLLECT_ERROR"),

  // Job scheduling and tracking
  jobScheduleCreate: createTopicName("JOB_SCHEDULE_CREATE"),
  jobScheduleUpdate: createTopicName("JOB_SCHEDULE_UPDATE"),
  jobStatus: createTopicName("JOB_STATUS"),
  jobProgress: createTopicName("JOB_PROGRESS"),

  // Data processing related topics
  dataProcessingStart: createTopicName("DATA_PROCESSING_START"),
  dataProcessingStatus: createTopicName("DATA_PROCESSING_STATUS"),
  dataProcessingResult: createTopicName("DATA_PROCESSING_RESULT"),

  // Data storage and aggregation
  dataStorage: createTopicName("DATA_STORAGE"),
  dataAggregation: createTopicName("DATA_AGGREGATION"),

  // Analysis and insights
  analysisRequest: createTopicName("ANALYSIS_REQUEST"),
  analysisResult: createTopicName("ANALYSIS_RESULT"),
  analysisError: createTopicName("ANALYSIS_ERROR"),

  // System notifications and logging
  alert: createTopicName("ALERT"),
  log: createTopicName("LOG"),
  notification: createTopicName("NOTIFICATION"),
  metric: createTopicName("METRIC"),

  // Reporting and dashboard
  report: createTopicName("REPORT"),
  dashboard: createTopicName("DASHBOARD")
};

module.exports = {
  topics
};
