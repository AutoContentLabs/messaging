// src/transports/topics.js

const environment = process.env.NODE_ENV || "development";

const createTopicName = (baseName) => {
  return process.env[`MESSAGING_TOPIC_${baseName.toUpperCase()}`] || `${baseName}.${environment}`;
};

const commonTopics = {
  dataCollectRequest: createTopicName("DATA_COLLECT_REQUEST"),
  dataCollectStatus: createTopicName("DATA_COLLECT_STATUS"),
  dataCollectResponse: createTopicName("DATA_COLLECT_RESPONSE"),
  dataCollectError: createTopicName("DATA_COLLECT_ERROR"),

  jobScheduleCreate: createTopicName("JOB_SCHEDULE_CREATE"),
  jobScheduleUpdate: createTopicName("JOB_SCHEDULE_UPDATE"),
  jobStatus: createTopicName("JOB_STATUS"),
  jobProgress: createTopicName("JOB_PROGRESS"),

  dataProcessingStart: createTopicName("DATA_PROCESSING_START"),
  dataProcessingStatus: createTopicName("DATA_PROCESSING_STATUS"),
  dataProcessingResult: createTopicName("DATA_PROCESSING_RESULT"),

  dataStorage: createTopicName("DATA_STORAGE"),
  dataAggregation: createTopicName("DATA_AGGREGATION"),

  analysisRequest: createTopicName("ANALYSIS_REQUEST"),
  analysisResult: createTopicName("ANALYSIS_RESULT"),
  analysisError: createTopicName("ANALYSIS_ERROR"),

  alerts: createTopicName("ALERTS"),
  logs: createTopicName("LOGS"),

  reports: createTopicName("REPORTS"),
  dashboard: createTopicName("DASHBOARD")
};

module.exports = commonTopics;
