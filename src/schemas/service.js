// src\schemas\service.js

const apiServiceParameters = require("./apiServiceParameters");
const dbServiceParameters = require("./dbServiceParameters");
const rssServiceParameters = require("./rssServiceParameters");
const serviceMeasurement = require("./serviceMeasurement")

module.exports =
{
    "type": "object",
    "properties": {
        "service_id": {
            "type": "number",
            "description": "Unique identifier for each service."
        },
        "status_type_id": {
            "type": "number",
            "description": "Status type of the service. Possible values: 1 - active, 2 - inactive, 3 - maintenance, 4 - under review, 5 - suspended."
        },
        "service_type_id": {
            "type": "number",
            "description": "Type of the service. Possible values: 1 - Web, 2 - API, 3 - FTP, 4 - DB, 5 - MQ, 6 - Stream, 7 - Batch."
        },
        "access_type_id": {
            "type": "number",
            "description": "Access type ID that refers to how the service is accessed. Possible values: 1 - API, 2 - RSS, 3 - HTML."
        },
        "fetch_frequency": {
            "type": "number",
            "description": "Frequency (in seconds) at which data is fetched from the external service."
        },
        "time_interval": {
            "type": "number",
            "description": "Interval (in seconds) between consecutive fetch operations. For real-time data, this may be set to 0."
        },
        "next_fetch": {
            "type": ["number", "null"],
            "description": "Timestamp for the next fetch operation, automatically calculated based on fetch_frequency."
        },
        "last_fetched": {
            "type": ["number", "null"],
            "description": "Timestamp for the last successful fetch operation."
        },
        "last_error_message": {
            "type": ["string", "null"],
            "description": "Stores the last error message encountered during the fetch operation. Helpful for debugging."
        },
        "access_method_id": {
            "type": "number",
            "description": "Indicates the method by which the service is accessed. Possible values: 1 - Free, 2 - Open Access, 3 - Subscription."
        },
        "data_format_id": {
            "type": "number",
            "description": "Specifies the data format. Possible values: 1 - JSON, 2 - XML, 3 - CSV, 4 - HTML."
        },
        "parameters": {
            "type": "object",
            "oneOf": [
                apiServiceParameters,
                dbServiceParameters,
                rssServiceParameters
            ]
        },
        "measurements": serviceMeasurement
    },
    "required": ["service_id", "service_type_id"],
    "additionalProperties": false
}