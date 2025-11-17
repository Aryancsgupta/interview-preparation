# Fix MongoDB Duplicate Key Error

## Problem
You're seeing this error:
```
E11000 duplicate key error collection: ai_interview_platform.results index: sessionId_1 dup key: { sessionId: null }
```

This happens because there's an old unique index on `sessionId` in your MongoDB database, but the current code doesn't use that field anymore.

## Solution

### Option 1: Run the cleanup script (Recommended)

Make sure your `.env` file in the `server` directory has `MONGODB_URI` set, then run:

```bash
cd server
npm run fix-index
```

Or directly:
```bash
cd server
node utils/dropOldIndex.js
```

**Note:** If you get an error about missing MONGODB_URI, make sure your `.env` file exists in the `server` directory with your MongoDB connection string.

### Option 2: Manual MongoDB fix

Connect to your MongoDB database and run:

```javascript
use ai_interview_platform
db.results.dropIndex("sessionId_1")
```

Or using MongoDB Compass or any MongoDB client:
1. Connect to your database
2. Navigate to the `results` collection
3. Go to the Indexes tab
4. Find and delete the `sessionId_1` index

### Option 3: Using MongoDB Shell (mongosh)

```bash
mongosh "your-mongodb-connection-string"
use ai_interview_platform
db.results.dropIndex("sessionId_1")
```

## After Fixing

Once the index is removed, the duplicate key error should be resolved. The application will continue to work normally without the `sessionId` field.

