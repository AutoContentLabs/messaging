# @auto-content-labs/messaging

## Installation

```
npm install git+https://github.com/AutoContentLabs/messaging.git
```

## Usage
```
const { sendMessage, startListener, onMessage, topics } = require('@auto-content-labs/messaging');

const dashboard = {
    key: 'dashboard-001',
    value: Buffer.from(JSON.stringify({
        timestamp: new Date().toISOString(),
        taskId: 'task-001',
        stats: { 'AI in healthcare': 15000, 'Quantum Computing': 12000 },
        message: 'Dashboard updated with latest trend statistics.'
    }))
};

startListener(topics.dashboard, onMessage);

sendMessage(topics.dashboard, [dashboard]);
```