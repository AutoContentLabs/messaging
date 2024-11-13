// src/transports/topics.js

const environment = process.env.NODE_ENV || "development";

const createTopicName = (baseName) => {
  return process.env[`MESSAGING_TOPIC_${baseName.toUpperCase()}`] || `${baseName}.${environment}`;
};

const commonTopics = {
  /**
   * Used when initiating a data collection process.
   */
  dataCollectRequest: createTopicName("DATA_COLLECT_REQUEST"),
  /**
   * Used to track the status of ongoing data collection tasks.
   */
  dataCollectStatus: createTopicName("DATA_COLLECT_STATUS"),
  /**
   * Used to send responses after data collection is initiated (e.g., success or failure).
   */
  dataCollectResponse: createTopicName("DATA_COLLECT_RESPONSE"),
  /**
   * Used to capture any issues that arise during data collection.
   */
  dataCollectError: createTopicName("DATA_COLLECT_ERROR"),

  /**
   * Used to trigger the creation of new scheduled tasks or jobs.
   */
  jobScheduleCreate: createTopicName("JOB_SCHEDULE_CREATE"),
  /**
   * Used for updates or changes to previously scheduled jobs.
   */
  jobScheduleUpdate: createTopicName("JOB_SCHEDULE_UPDATE"),
  /**
   *  Used to monitor the progress or completion status of jobs.
   */
  jobStatus: createTopicName("JOB_STATUS"),
  /**
   * Used to track the progress of long-running jobs, such as percentage completion.
   */
  jobProgress: createTopicName("JOB_PROGRESS"),

  /**
   * Used to notify when data processing begins.
   */
  dataProcessingStart: createTopicName("DATA_PROCESSING_START"),
  /**
   * Used to report the current status of data processing tasks.
   */
  dataProcessingStatus: createTopicName("DATA_PROCESSING_STATUS"),
  /**
   * Used for sending the output after data transformation or aggregation.
   */
  dataProcessingResult: createTopicName("DATA_PROCESSING_RESULT"),

  /**
   * Used for sending processed data to storage systems or databases.
   */
  dataStorage: createTopicName("DATA_STORAGE"),
  /**
   * Used to aggregate or summarize data for further analysis.
   */
  dataAggregation: createTopicName("DATA_AGGREGATION"),

  /**
   * Used to request the analysis or querying of specific data or insights.
   */
  analysisRequest: createTopicName("ANALYSIS_REQUEST"),
  /**
   * Used to deliver the insights or results from the analysis.
   */
  analysisResult: createTopicName("ANALYSIS_RESULT"),
  /**
   * Used to report any failures or issues during the analysis process.
   */
  analysisError: createTopicName("ANALYSIS_ERROR"),

  /**
   * Used for notifying about critical errors, system failures, or anomalies.
   */
  alerts: createTopicName("ALERTS"),
  /**
   * Used to capture logs related to system events, errors, or other actions.
   */
  logs: createTopicName("LOGS"),

  /**
   * Used for sending aggregated or processed data to reporting systems.
   */
  reports: createTopicName("REPORTS"),

  /**
   * Used to send real-time data for display on monitoring dashboards.
   */
  dashboard: createTopicName("DASHBOARD")
};

module.exports = commonTopics;
