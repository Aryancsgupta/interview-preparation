# Quick Fix for MongoDB Duplicate Key Error

## Run this command in MongoDB

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Connect to your database
3. Open the MongoDB Shell (bottom left)
4. Run this command:

```javascript
use ai_interview_platform
db.results.dropIndex("sessionId_1")
```

### Using mongosh (MongoDB Shell):
```bash
mongosh "your-connection-string"
use ai_interview_platform
db.results.dropIndex("sessionId_1")
```

### Using Node.js REPL (if you have mongoose connected):
```javascript
const mongoose = require('mongoose');
// Connect first, then:
mongoose.connection.db.collection('results').dropIndex('sessionId_1')
```

## Verify it worked:
```javascript
db.results.getIndexes()
```

You should NOT see `sessionId_1` in the list anymore.

