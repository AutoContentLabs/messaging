module.exports =
{
    "properties": {
        "username": {
            "type": "string",
            "description": "Database connection username."
        },
        "password": {
            "type": "string",
            "description": "Database connection password."
        },
        "database_name": {
            "type": "string",
            "description": "The name of the database to connect to."
        },
        "host": {
            "type": "string",
            "description": "The host or IP address where the database is located."
        },
        "port": {
            "type": "number",
            "description": "The port number for database connection."
        },
        "schema": {
            "type": "string",
            "description": "The schema to use within the database."
        },
        "connectionString": {
            "type": "string",
            "description": "Construct the DB connection string"
        }
    },
    "required": [
        "username",
        "password",
        "database_name",
        "host",
        "port"
    ],
    "additionalProperties": false,
    "description": "Database Service specific parameters"
}