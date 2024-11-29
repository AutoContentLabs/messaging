/**
 * @enum {number}
 * @readonly
 */
const StatusType = {
    ACTIVE: 1, // Service is active
    INACTIVE: 2, // Service is inactive
    MAINTENANCE: 3, // Service is under maintenance
    UNDER_REVIEW: 4, // Service is under review
    SUSPENDED: 5 // Service is suspended
};

/**
 * @enum {number}
 * @readonly
 */
const ServiceType = {
    WEB: 1, // Service is a Web service
    API: 2, // Service is an API
    FTP: 3, // Service is FTP
    DB: 4, // Service is a Database
    MQ: 5, // Service is a Message Queue
    STREAM: 6, // Service is Streaming
    BATCH: 7 // Service is Batch processing
};

/**
 * @enum {number}
 * @readonly
 */
const AccessType = {
    API: 1,
    RSS: 2,
    HTML: 3
};

/**
 * @enum {number}
 * @readonly
 */
const DataFormat = {
    JSON: 1,
    XML: 2,
    CSV: 3,
    HTML: 4
};

/**
 * @enum {number}
 * @readonly
 */
const AccessMethod = {
    FREE: 1,
    OPEN_ACCESS: 2,
    SUBSCRIPTION: 3
};

module.exports = {
    StatusType,
    ServiceType,
    AccessType,
    DataFormat,
    AccessMethod
};
