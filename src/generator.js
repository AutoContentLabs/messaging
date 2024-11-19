/**
 * Create automaticly own model
 */
const fs = require("fs");
const path = require("path");

const schemas = require("./schemas");
const { topics } = require("./topics");

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const handlerTemplate = (topic, properties) => `
/**
 * ${topic} handler
 * src/handlers/${topic}Handler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming ${topic} messages.
 * @param {Object} model - The incoming model.
 */
async function handle${capitalizeFirstLetter(topic)}Request(model) {
  try {
    logger.debug(\`[${topic}Handler] Processing request...\`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    ${properties.length > 0 ? `const { ${properties.join(", ")} } = handleMessageData;` : "// No properties defined in schema"}
      
    logger.info(\`[handle${capitalizeFirstLetter(topic)}] Processed request successfully: ${
      properties.length > 0 ? properties.map((prop) => `\${${prop}}`).join(", ") : "No data to log"
    }\`);
  } catch (error) {
    logger.error(\`[${topic}Handler] Error processing request: \${error.message}\`);
  }
}

module.exports = { handle${capitalizeFirstLetter(topic)}Request };
`;

const senderTemplate = (topic, schemaName) => `
/**
 * ${topic} sender
 * src/senders/${topic}Sender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "${schemaName}";
const eventName = "${schemaName}";
const sender = createModel(schemaName, eventName);

/**
 * Sends a ${topic} to the specified topic.
 * @param {Object} model - The ${topic} request model.
 * @throws Will throw an error if sending fails.
 */
async function send${capitalizeFirstLetter(topic)}Request(model) {
  try {
    logger.debug(\`[${topic}Sender] Validating and sending request...\`);
    await sender.send(model);
    logger.info(\`[${topic}Sender] Request sent successfully.\`);
  } catch (error) {
    logger.error(\`[${topic}Sender] Failed to send request: \${error.message}\`);
    throw error;
  }
}

module.exports = { send${capitalizeFirstLetter(topic)}Request };
`;

const basePath = __dirname;

// Loop through topics
Object.keys(topics).forEach((topicKey) => {
  // Get the schema name corresponding to the topic
  const schemaName = topics[topicKey];

  // Get the properties from the schema
  const properties = Object.keys((schemas[schemaName] || {}).properties || {});

  // Create handler file with the correct lowercase name
  const handlerPath = path.join(basePath, `handlers/${topicKey}Handler.js`);
  fs.writeFileSync(handlerPath, handlerTemplate(topicKey, properties));

  // Create sender file with the correct lowercase name
  const senderPath = path.join(basePath, `senders/${topicKey}Sender.js`);
  fs.writeFileSync(senderPath, senderTemplate(topicKey, schemaName));
});
