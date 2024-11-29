/**
 * dataCollectRequestHandler handler
 * src/handlers/dataCollectRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

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
 * @typedef {Object} DBServiceParameters
 * @property {string} username - The username for database connection.
 * @property {string} password - The password for database connection.
 * @property {string} database_name - The name of the database to connect to.
 * @property {string} host - The host or IP address where the database is located.
 * @property {number} port - The port number for database connection.
 * @property {string} schema - The schema to use within the database.
 */

/**
 * @typedef {Object} RSSServiceParameters
 * @property {string} rss_feed_url - The URL of the RSS feed.
 * @property {number} refresh_interval - The refresh interval for the RSS feed, in seconds.
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
 * Handles incoming dataCollectRequestHandler messages.
 * 
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {DataCollectRequest} pair.value - The incoming model data (dataCollectRequest schema).
 * @param {Object} pair.headers - Headers of the message.
 * @param {number} pair.timestamp - Timestamp of the message.
 */
async function handleDataCollectRequest(pair) {
  try {
    logger.debug(`[dataCollectResponseHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring, handleMessageData.value is expected to be of type DataCollectRequest
    /** @type {DataCollectRequest} */
    const { id, service } = handleMessageData.value;
    const { service_id, status_type_id, service_type_id, access_type_id, data_format_id, parameters } = service;

    // Determine the service type and handle parameters accordingly
    let model = { id, service, parameters }

    switch (service_type_id) {
      case 1: // Web service
        model.parameters = await handleWebServiceParameters(parameters);
        break;
      case 2: // API service
        model.parameters = await handleAPIServiceParameters(parameters);
        break;
      case 3: // FTP service
        model.parameters = await handleFTPServiceParameters(parameters);
        break;
      case 4: // DB service
        model.parameters = await handleDBServiceParameters(parameters);
        break;
      case 5: // MQ service
        model.parameters = await handleMQServiceParameters(parameters);
        break;
      case 6: // Stream service
        model.parameters = await handleStreamServiceParameters(parameters);
        break;
      case 7: // Batch service
        model.parameters = await handleBatchServiceParameters(parameters);
        break;
      default:
        logger.warn(`[dataCollectResponseHandler] Unknown service type: ${service_type_id}`);
        break;
    }

    // Processed data can be logged or returned depending on your application logic
    logger.info(`[handleDataCollectResponse] Processed request successfully: ${id}`, model);
    return model

  } catch (error) {
    logger.error(`[dataCollectResponseHandler] Error processing request: ${error.message}`);
    return model
  }

}

// Example handler for API Service
async function handleAPIServiceParameters(parameters) {
  const { protocol, domain, port, path, query_parameters, request_method, rate_limit, rate_limit_window, timeout, retry_count, cache_duration, cache_enabled, max_connections, api_key, logging_enabled, allowed_origins, error_handling, authentication_required, authentication_details } = parameters;

  // Remove any null or undefined query parameters
  const filteredQueryParams = Object.fromEntries(
    Object.entries(query_parameters).filter(([key, value]) => value != null)
  );

  // Construct the query string only if there are query parameters
  const queryString = Object.keys(filteredQueryParams).length > 0
    ? `?${new URLSearchParams(filteredQueryParams).toString()}`
    : '';

  // Construct the final URL without trailing ?
  const url = `${protocol}://${domain}:${port}${path ? path : ''}${queryString}`;

  // Log or return the processed data
  return {
    ...parameters,
    url
  };
}


// Example handler for DB Service
async function handleDBServiceParameters(parameters) {
  const { username, password, database_name, host, port, schema } = parameters;

  // Example: Construct the DB connection string
  const connectionString = `mysql://${username}:${password}@${host}:${port}/${database_name}`;

  // Return the processed DB data
  return {
    ...parameters,
    connectionString
  };
}

// Example handler for FTP Service (you can implement other service handlers similarly)
async function handleFTPServiceParameters(parameters) {
  const { protocol, domain, port, path, rate_limit, retry_count } = parameters;

  // Process FTP service parameters
  const url = `${protocol}://${domain}:${port}${path}`

  return {
    ...parameters,
    url
  };
}

module.exports = { handleDataCollectRequest };
