# Queue System Setup - pg-boss with Next.js Instrumentation

This project uses **pg-boss** for asynchronous file parsing. When files are uploaded, they are immediately stored and parsing jobs are queued for background processing.

## Architecture Overview

The queue system is built using Next.js instrumentation, allowing you to run the same codebase in different modes:

- **Web Server Mode**: Serves the Next.js application only
- **Worker Mode**: Processes background jobs only  
- **Both Mode**: Runs web server and worker in the same process

## How it Works

1. **File Upload**: Files are uploaded to S3 and statement records are created
2. **Job Queuing**: A `parse_file` job is queued using the existing Next.js code
3. **Background Processing**: The worker process picks up jobs and processes files
4. **Data Storage**: Extracted data is stored in the statement's `extracted_data` field

All processes use the **exact same Next.js codebase** - no code duplication!

## Development Setup

### 1. Database Setup
pg-boss uses your existing PostgreSQL database (`DB_APP` connection string). It will automatically create the necessary tables in the `pgboss` schema.

### 2. Running in Development

#### Option A: Separate Processes (Recommended)
```bash
# Terminal 1: Web server only
MODE=server npm run dev

# Terminal 2: Worker only  
MODE=worker npm run dev
```

#### Option B: Single Process (Both)
```bash
# Single process with web server + worker
MODE=both npm run dev
# or simply:
npm run dev
```

#### Option C: Using npm scripts
```bash
# Runs both server and worker in separate processes
npm run worker:dev
```

### 3. Available npm Scripts

- `npm run dev` - Next.js development (both mode by default)
- `MODE=server npm run dev` - Web server only
- `MODE=worker npm run dev` - Worker only
- `npm run worker:dev` - Both server and worker in separate processes
- `MODE=both npm run dev` - Both in same process (explicit)

## Production Deployment

### 1. Separate Processes (Recommended)
Run web server and worker as separate processes:

```bash
# Process 1: Web server
MODE=server npm run start

# Process 2: Worker  
MODE=worker npm run start
```

### 2. Single Process (Alternative)
Run both web server and worker in the same process:

```bash
MODE=both npm run start
# or simply:
npm run start
```

### 3. Process Management
Consider using a process manager like PM2:

```bash
# Web server
pm2 start npm --name "cashflowy-web" --env MODE=server -- run start

# Worker
pm2 start npm --name "cashflowy-worker" --env MODE=worker -- run start
```

### 4. Docker Deployment
For containerized deployments:

```dockerfile
# Web server container
ENV MODE=server
CMD ["npm", "run", "start"]

# Worker container  
ENV MODE=worker
CMD ["npm", "run", "start"]
```

## Configuration

### Environment Variables
The worker behavior is controlled by the `MODE` environment variable:

- `MODE=server` - Web server only
- `MODE=worker` - Worker only
- `MODE=both` - Both web server and worker (default)

### Job Configuration

#### parse_file Job
- **Retry Limit**: 3 attempts
- **Retry Delay**: 5 seconds  
- **Expiration**: 60 minutes
- **Concurrency**: 3 files processed simultaneously
- **Priority**: PDF files have lower priority (-1)

#### Supported File Types
- **CSV**: Text/CSV files
- **Excel**: XLS and XLSX files
- **PDF**: PDF documents (parsed with pdf2json)

## Architecture Details

### File Structure
```
src/
├── instrumentation.js       # Next.js instrumentation (controls MODE)
├── lib/
│   ├── queue.js            # pg-boss interface (shared by all modes)
│   └── worker.js           # Worker startup logic (shared)
├── jobs/
│   └── parseFile.js        # Job handlers (shared)
└── components/
    └── FileDropzone/
        └── action.js       # Queues jobs using shared queue.js
```

### How Instrumentation Works
- Next.js calls `instrumentation.js` on startup
- Based on `MODE` environment variable, it either:
  - Starts web server only (`server`)
  - Starts worker only (`worker`)  
  - Starts both (`both`)

### Code Reuse
All modes use the **exact same code**:
- Same database models (`@/database/models`)
- Same job handlers (`@/jobs/parseFile`) 
- Same parsing utilities (`@/utils/server/parser`)
- Same queue interface (`@/lib/queue`)

## Monitoring

### Queue Statistics
In worker-only mode, queue size is logged every 30 seconds when jobs are pending.

### Health Check
The queue service provides a health check:
```javascript
import { healthCheck } from '@/lib/queue';
const health = await healthCheck();
```

### Database Tables  
pg-boss creates these tables in the `pgboss` schema:
- `job` - Active and pending jobs
- `archive` - Completed/failed jobs (cleaned up after 24 hours)
- `version` - Schema version tracking

## Error Handling

### Job Failures
When a job fails:
1. Error is logged with full stack trace
2. Statement record is updated with error information  
3. Job is retried up to 3 times with 5-second delays
4. After all retries fail, job moves to `failed` state

### Worker Failures
The worker handles graceful shutdown:
- `SIGTERM`/`SIGINT` signals trigger graceful shutdown
- Current jobs finish processing before shutdown
- Database connections are properly closed

## Benefits of This Architecture

### ✅ **No Code Duplication**
- Worker uses exact same Next.js code as web server
- Same imports, models, utilities work everywhere  
- Business logic written once, used everywhere

### ✅ **Flexible Deployment**
- Can run as separate processes or single process
- Easy to scale web server and worker independently
- Same Docker image can be used for both modes

### ✅ **Simple Development**
- Single codebase to maintain
- Same development environment for web and worker
- Easy debugging and testing

### ✅ **Production Ready**
- Proper process separation when needed
- Shared process option for simpler deployments
- Built on Next.js instrumentation (official API)

## Migration from Previous Setup

If you had the old isolated worker setup, this new approach:
- ✅ Eliminates duplicate code
- ✅ Simplifies maintenance  
- ✅ Uses same Next.js runtime for everything
- ✅ Provides same functionality with cleaner architecture

No changes needed to your existing queue usage - the API remains the same!