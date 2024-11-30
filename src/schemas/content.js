module.exports =
{
    "type": "object",
    "properties": {
        "content_type": {
            "type": "string",
            "enum": ["json", "xml", "csv", "html", "yaml"],
            "description": "The type of content being collected."
        },
        "content_length": {
            "type": "integer",
            "description": "The length of the content (in bytes)."
        },
        "data": {
            "type": "array",
            "description": "The actual collected data, this could be a JSON object or any other structure based on the content type."
        }
    },
    "required": ["content_type", "content_length", "data"],
    "additionalProperties": false
}

