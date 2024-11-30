// src\schemas\metric.js

module.exports =
{
    "type": "object",
    "properties": {
        "metric_id": {
            "type": "integer",
            "description": "Unique identifier for the measurement."
        },
        "measurement_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the measurement was taken."
        },
        "measurement_start_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the processes started."
        },
        "measurement_end_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the processes ended."
        },
        "metric_type": {
            "type": "string",
            "enum": ["performance", "usage", "error_rate", "engagement", "traffic", "conversion"],
            "description": "Type of the metric being recorded."
        },
        "metric_value": {
            "type": "number",
            "description": "The value of the metric being measured (e.g., performance score)."
        }
    },
    "required": ["measurement_time", "metric_type", "metric_value"],
    "additionalProperties": false
}
