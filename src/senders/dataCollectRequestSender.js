/**
 * dataCollectRequest sender
 * src/senders/dataCollectRequestSender.js
 */


const { logger } = require("@auto-content-labs/messaging-utils");
const { StatusType, ServiceType, AccessType, DataFormat, AccessMethod } = require("../constants/enum");
const { createModel } = require("../models/createModel");

const schemaName = "DATA_COLLECT_REQUEST";
const eventName = "DATA_COLLECT_REQUEST";
const sender = createModel(schemaName, eventName);

/**
 * @typedef {Object} DataCollectRequest
 * @property {string} id - The unique identifier for the data collect request.
 * @property {Service} service - The service object associated with the request.
 */

/**
 * @typedef {Object} Service
 * @property {number} service_id - The unique identifier for the service.
 * @property {number} status_type_id - The status type ID of the service.
 * Valid values:
 * - {@link StatusType.ACTIVE} for active services (1)
 * - {@link StatusType.INACTIVE} for inactive services (2)
 * - {@link StatusType.MAINTENANCE} for maintenance (3)
 * - {@link StatusType.UNDER_REVIEW} for under review (4)
 * - {@link StatusType.SUSPENDED} for suspended services (5)
 * @property {number} service_type_id - The type ID of the service.
 * Valid values:
 * - {@link ServiceType.WEB} for web services (1)
 * - {@link ServiceType.API} for APIs (2)
 * - {@link ServiceType.FTP} for FTP services (3)
 * - {@link ServiceType.DB} for Database services (4)
 * - {@link ServiceType.MQ} for Message Queue services (5)
 * - {@link ServiceType.STREAM} for Streaming services (6)
 * - {@link ServiceType.BATCH} for Batch services (7)
 * @property {number} [access_type_id] - The access type ID (optional).
 * Valid values:
 * - {@link AccessType.API} for API access (1)
 * - {@link AccessType.RSS} for RSS access (2)
 * - {@link AccessType.HTML} for HTML access (3)
 * @property {number} [data_format_id] - The data format ID (optional).
 * Valid values:
 * - {@link DataFormat.JSON} for JSON format (1)
 * - {@link DataFormat.XML} for XML format (2)
 * - {@link DataFormat.CSV} for CSV format (3)
 * - {@link DataFormat.HTML} for HTML format (4)
 * @property {Parameters} parameters - The parameters for the service (required).
 */

/**
 * @typedef {Object} Parameters
 * @description Parameters vary based on the service type. The specific parameters will depend on the `service_type_id`.
 * 
 * {@link ServiceType.API} requires parameters such as:
 * - `protocol`, `domain`, `path`, `query_parameters`, `request_method`, etc.
 * 
 * {@link ServiceType.DB} requires parameters like:
 * - `username`, `password`, `database_name`, `host`, `port`, etc.
 * 
 * {@link ServiceType.RSS} requires:
 * - `rss_feed_url`, `refresh_interval`, etc.
 * 
 * The following properties are common across service types:
 * - `rate_limit`, `rate_limit_window`, `timeout`, `retry_count`, etc.
 */

/**
 * @typedef {Object} WebServiceParameters
 * @property {string} protocol - The protocol used (e.g., HTTP, HTTPS).
 * @property {string} domain - The domain or hostname.
 * @property {number} port - The port number to connect to.
 * @property {string} path - The path to be used in the request (e.g., "/api/v1/data").
 * @property {QueryParameters} query_parameters - Query parameters for the request.
 * @property {string} request_method - The HTTP request method (e.g., GET, POST).
 * @property {number} [rate_limit] - The rate limit for the service (optional).
 * @property {number} [timeout] - The timeout value for the request in milliseconds.
 */

/**
 * @typedef {Object} RSSServiceParameters
 * @property {string} rss_feed_url - The URL of the RSS feed.
 * @property {number} refresh_interval - The refresh interval for the RSS feed, in seconds.
 */

/**
 * @typedef {Object} APIServiceParameters
 * @property {string} protocol - The protocol used to fetch the data (e.g., HTTP, FTP).
 * @property {string} domain - The domain or hostname for the service.
 * @property {number} port - The port number to connect to the service.
 * @property {string} path - The path to be used in the request (e.g., "/api/v1/data").
 * @property {QueryParameters} query_parameters - The query parameters for the request (e.g., geo).
 * @property {string} request_method - The HTTP request method (e.g., GET, POST).
 * @property {number} [rate_limit] - The rate limit for requests (optional).
 * @property {number} [rate_limit_window] - The time window for the rate limit (optional).
 * @property {number} [timeout] - The timeout value for the request in milliseconds (optional).
 * @property {number} [retry_count] - The number of retry attempts in case of failure (optional).
 * @property {number} [cache_duration] - The cache duration for the service (optional).
 * @property {boolean} [cache_enabled] - Whether caching is enabled (optional).
 * @property {number} [max_connections] - The maximum number of connections allowed (optional).
 * @property {string} [api_key] - The API key required for the service (optional).
 * @property {boolean} [logging_enabled] - Whether logging is enabled (optional).
 * @property {string} [allowed_origins] - The allowed origins for cross-origin requests (optional).
 * @property {string} [error_handling] - The error handling strategy (optional).
 * @property {boolean} authentication_required - Whether authentication is required (optional).
 * @property {AuthenticationDetails} [authentication_details] - The authentication details if required (optional).
 */

/**
 * @typedef {Object} FTPServiceParameters
 * @property {string} host - The hostname or IP address of the FTP server.
 * @property {number} port - The port number for FTP connection.
 * @property {string} username - The username for FTP authentication.
 * @property {string} password - The password for FTP authentication.
 * @property {string} directory - The directory to access in the FTP server.
 */

/**
 * @typedef {Object} DBServiceParameters
 * @property {string} username - The username for database connection.
 * @property {string} password - The password for database connection.
 * @property {string} database_name - The name of the database to connect to.
 * @property {string} host - The host or IP address where the database is located.
 * @property {number} port - The port number for database connection.
 * @property {string} schema - The schema to use within the database.
 */

/**
 * @typedef {Object} MQServiceParameters
 * @property {string} queue_name - The name of the message queue.
 * @property {string} message_format - The format of the message (e.g., JSON, XML).
 * @property {number} [max_retry] - The number of retry attempts (optional).
 * @property {number} [retry_interval] - The interval between retries in milliseconds.
 */

/**
 * @typedef {Object} StreamServiceParameters
 * @property {string} stream_url - The URL of the streaming service.
 * @property {string} stream_type - The type of stream (e.g., audio, video).
 * @property {number} buffer_size - The buffer size for streaming.
 * @property {number} [timeout] - The timeout value for the connection in milliseconds.
 */

/**
 * @typedef {Object} BatchServiceParameters
 * @property {string} job_type - The type of batch job (e.g., data_processing, report_generation).
 * @property {number} batch_size - The number of records to process in a batch.
 * @property {string} schedule_time - The scheduled time for the batch job to run.
 * @property {boolean} [retry_enabled] - Whether retries are enabled for the batch job.
 * @property {number} [max_retries] - The maximum number of retries for the batch job.
 */

/**
 * @typedef {Object} QueryParameters
 * @property {string} geo - The geographical query parameter (optional).
 */

/**
 * @typedef {Object} AuthenticationDetails
 * @property {string} type - The type of authentication.
 * Valid values:
 * - 'Basic' for Basic Authentication
 * - 'OAuth' for OAuth Authentication
 * @property {string} location - The location for the authentication.
 * Valid values:
 * - 'header' for HTTP header
 * - 'query' for query parameter
 * @property {boolean} required - Whether authentication is required.
 */

/**
 * Sends a dataCollectRequest to the specified topic.
 * 
 * @param {DataCollectRequest} pair.value - The dataCollectRequest request model.
 * @param {string} pair.headers.correlationId - The correlationId used for tracking the request.
 * @param {string} pair.headers.traceId - The traceId used for tracking the request. 
* @throws Will throw an error if sending fails.
 */
async function sendDataCollectRequest(pair) {

  try {
    logger.debug(`[dataCollectRequestSender] Validating and sending request...`);
    await sender.send(pair);
    logger.info(`[dataCollectRequestSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataCollectRequestSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectRequest };
