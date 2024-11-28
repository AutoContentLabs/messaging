const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Body parser middleware to handle JSON data
app.use(bodyParser.json());

// Endpoint to receive Zipkin data
app.post('/api/v2/spans', (req, res) => {
  console.log('Received Zipkin data:');
  console.log(JSON.stringify(req.body, null, 2)); // Log the received Zipkin trace data
  res.status(200).send('OK');
});

// Endpoint to receive Jaeger data
app.post('/api/traces', (req, res) => {
  console.log('Received Jaeger data:');
  console.log(JSON.stringify(req.body, null, 2)); // Log the received Jaeger trace data
  res.status(200).send('OK');
});

// Start the server
app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});
