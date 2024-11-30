// example/senders/sendDataCollectResponseRequest.js

const { StatusType, ServiceType, AccessType, DataFormat, AccessMethod, sendDataCollectResponseRequest } = require("../../src/");
(async () => {
    try {
        const exampleData = {
            "title": "GitHub · Build and ship software on a single, collaborative platform · GitHubTwitchTikTok",
            "headings": [
                "Search code, repositories, users, issues, pull requests...",
            ],
            "paragraphs": [
                "We read every piece of feedback, and take your input very seriously.",
            ]
        }
        const value = {
            id: "response-123",  // Unique response ID
            service: {
                service_id: 1,  // Unique service identifier
                status_type_id: StatusType.ACTIVE,  // Service status (active, maintenance, etc.)
                service_type_id: ServiceType.API,  // Type of the service (API, Web, etc.)
                access_type_id: AccessType.RSS,  // Access type for the service (RSS, API, etc.)
                fetch_frequency: 300,  // Frequency at which data is fetched
                time_interval: 0,  // Interval between fetch operations
                next_fetch: null,  // Timestamp of the next fetch
                last_fetched: 1628501234,  // Last successful fetch timestamp
                last_error_message: null,  // Last error message if any occurred
                access_method_id: AccessMethod.OPEN_ACCESS,  // Access method for the service
                data_format_id: DataFormat.XML,  // Data format for the service response
                parameters: {
                    protocol: "https",  // Protocol used (e.g., https)
                    domain: "example.com",  // Domain for the service
                    port: 443,  // Port number
                    path: null,  // Path for the service
                    query_parameters: {
                        geo: null //"US"  // Query parameters (e.g., geo=US)
                    },
                    request_method: "GET",  // Request method (e.g., GET, POST)
                    rate_limit: 100,  // Rate limit for the service
                    rate_limit_window: 60,  // Time window for rate limiting
                    timeout: 1000,  // Timeout for requests in ms
                    retry_count: 3,  // Retry attempts for failed requests
                    cache_duration: 3600,  // Cache duration in seconds
                    cache_enabled: true,  // Cache status
                    max_connections: 5,  // Maximum connections allowed
                    api_key: "YOUR_API_KEY",  // API key if required
                    logging_enabled: true,  // Logging enabled or not
                    allowed_origins: "*",  // Allowed origins for CORS
                    error_handling: "retry",  // Error handling method (e.g., retry, abort)
                    authentication_required: true,  // Whether authentication is required
                    authentication_details: {
                        type: "OAuth",  // Type of authentication (e.g., OAuth, Basic)
                        location: "header",  // Where to place the authentication (e.g., header)
                        required: true  // Whether authentication is required
                    }
                },
                measurements: {
                    service_id: 1,
                    metric_id: 101,
                    measurement_time: "2024-11-30T12:00:00Z",
                    measurement_start_time: "2024-11-30T11:50:00Z",
                    measurement_end_time: "2024-11-30T12:00:00Z",
                    metric_type: "performance",
                    metric_value: 98.6
                }
            },
            content: {
                content_type: "json",
                content_length: 1,
                data: [exampleData]
            },

        };
        const pair = { value }
        await sendDataCollectResponseRequest(pair);
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();
