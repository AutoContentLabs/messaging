# @auto-content-labs/messaging

## Installation

```
const { sendMessage } = require('@auto-content-labs/messaging');

sendMessage('test_topic', { text: 'Hello, World!' });
```

```
const { consumeMessages } = require('@auto-content-labs/messaging');

consumeMessages('test_topic', (message) => {
  console.log('Received message:', message);
});
```