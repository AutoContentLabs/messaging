const config = require("./config")
const topics = require("./topics")
const kafka = require("./kafka")
const systems = { kafka }

module.exports = { systems, config, topics }