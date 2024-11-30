module.exports =
{
    "type": "object",
    "properties": {
        "data": {
            "type": "array",
            "description": "The actual collected data, this could be a JSON object or any other structure based on the content type."
        },
        "content_type": {
            "type": "string",
            "enum": ["json", "xml", "csv", "other"],
            "description": "The type of content being collected."
        },
        "content_length": {
            "type": "integer",
            "description": "The length of the content (in bytes)."
        }
    },
    "required": ["data", "content_length"],
    "additionalProperties": false
}

