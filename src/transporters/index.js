/**
 * Transporters
 * src\transporters\index.js
 */

const kafkaTransporter = require("./kafkaTransporter")
module.exports = {
    kafka: kafkaTransporter
}