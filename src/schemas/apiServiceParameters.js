module.exports =
{
    "properties": {
        "protocol": {
            "type": "string",
            "description": "The protocol used for fetching data (e.g., HTTP, HTTPS, FTP)."
        },
        "domain": {
            "type": "string",
            "description": "The domain or hostname of the service (e.g., example.com)."
        },
        "port": {
            "type": "number",
            "description": "The port number to connect to the service (e.g., 80 for HTTP, 443 for HTTPS)."
        },
        "path": {
            "type": ["string", "null"],
            "description": "The path to the resource on the service (e.g., /api/v1/data)."
        },
        "query_parameters": {
            "type": "object",
            "properties": {
                "geo": {
                    "type": ["string", "null"],
                    "description": "Geographical filter for the data. E.g., 'US' for United States."
                }
            }
        },
        "request_method": {
            "type": "string",
            "description": "The HTTP method used for the request. E.g., GET, POST."
        },
        "rate_limit": {
            "type": "number",
            "description": "The maximum number of requests allowed per time window."
        },
        "rate_limit_window": {
            "type": "number",
            "description": "The duration (in seconds) of the rate limit window."
        },
        "timeout": {
            "type": "number",
            "description": "The timeout value in milliseconds for the request."
        },
        "retry_count": {
            "type": "number",
            "description": "Number of retry attempts in case of failure."
        },
        "cache_duration": {
            "type": "number",
            "description": "The duration for which the fetched data will be cached (in seconds)."
        },
        "cache_enabled": {
            "type": "boolean",
            "description": "Indicates if caching is enabled or not."
        },
        "max_connections": {
            "type": "number",
            "description": "The maximum number of concurrent connections allowed."
        },
        "api_key": {
            "type": ["string", "null"],
            "description": "The API key for accessing the service (if required)."
        },
        "logging_enabled": {
            "type": "boolean",
            "description": "Indicates if logging is enabled for the service."
        },
        "allowed_origins": {
            "type": "string",
            "description": "The allowed origins for CORS (Cross-Origin Resource Sharing)."
        },
        "error_handling": {
            "type": "string",
            "description": "Defines the error handling strategy (e.g., 'retry', 'abort')."
        },
        "authentication_required": {
            "type": "boolean",
            "description": "Indicates if authentication is required for accessing the service."
        },
        "authentication_details": {
            "type": "object",
            "properties": {
                "type": {
                    "type": ["string", "null"],
                    "description": "The type of authentication required (e.g., Basic, OAuth)."
                },
                "location": {
                    "type": ["string", "null"],
                    "description": "Where to place the authentication details (e.g., header, query parameter)."
                },
                "required": {
                    "type": ["boolean", "null"],
                    "description": "Indicates if authentication is required for this service."
                }
            }
        }
    },
    "required": ["protocol", "domain", "port", "request_method"],
    "additionalProperties": false,
    "description": "API Service specific parameters"
}