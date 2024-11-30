module.exports =
{
    "properties": {
        "rss_feed_url": {
            "type": "string",
            "description": "The URL of the RSS feed."
        },
        "refresh_interval": {
            "type": "number",
            "description": "The refresh interval for the RSS feed, in seconds."
        }
    },
    "required": ["rss_feed_url"],
    "additionalProperties": false,
    "description": "RSS Service specific parameters"
}