module.exports =
{
    "type": "object",
    "properties": {
        "metric_id": {
            "type": "integer",
            "description": "Unique identifier for the measurement."
        },
        "service_id": {
            "type": "integer",
            "description": "which service is measurement."
        },
        "measurement_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the measurement was taken."
        },
        "fetch_start_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the data collection started."
        },
        "fetch_end_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the data collection ended."
        },
        "metric_type": {
            "type": "string",
            "enum": ["performance", "usage", "error_rate", "other"],
            "description": "Type of the metric being recorded."
        },
        "metric_value": {
            "type": "number",
            "description": "The value of the metric being measured (e.g., performance score)."
        },
        "metrics": {
            "type": "object",
            "description": "Additional custom metrics in JSON format."
        },
    },
    "required": ["service_id", "measurement_time", "fetch_start_time", "fetch_end_time", "metric_type", "metric_value"],
    "additionalProperties": false
}
