import 'server-only';
import PgBoss from 'pg-boss';

let boss = null;

/**
 * Initialize pg-boss instance with PostgreSQL connection
 */
async function initializeBoss() {
  if (boss) {
    console.log(`🎯 [initializeBoss] Reusing existing boss instance`);
    return boss;
  }

  console.log(`🎯 [initializeBoss] Creating new pg-boss instance...`);
  console.log(`🎯 [initializeBoss] Connection string:`, process.env.DB_APP ? 'SET' : 'NOT SET');
  
  try {
    boss = new PgBoss({
      connectionString: process.env.DB_APP,
      schema: 'pgboss',
      // Configuration options
      newJobCheckInterval: 1000,       // Check for new jobs every 1 second
      maxCheckInterval: 10000,         // Maximum interval between checks
      archiveCompletedAfterSeconds: 60 * 60 * 24, // Archive completed jobs after 24 hours
      deleteAfterDays: 7,              // Delete archived jobs after 7 days
      retentionDays: 30,               // Keep job history for 30 days
      monitorStateIntervalSeconds: 10,  // Monitor state every 10 seconds
    });

    console.log(`🎯 [initializeBoss] PgBoss instance created, starting...`);

    // Handle process termination gracefully
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down pg-boss gracefully...');
      await boss?.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down pg-boss gracefully...');
      await boss?.stop();
      process.exit(0);
    });

    await boss.start();
    console.log(`✅ [initializeBoss] pg-boss started successfully`);

    return boss;
    
  } catch (error) {
    console.error(`❌ [initializeBoss] Error initializing pg-boss:`, error);
    console.error(`❌ [initializeBoss] Error stack:`, error.stack);
    boss = null;
    throw error;
  }
}

/**
 * Get the pg-boss instance (initialize if needed)
 */
export async function getBoss() {
  if (!boss) {
    await initializeBoss();
  }
  return boss;
}

/**
 * Add a job to the queue - MINIMAL VERSION
 * @param {string} jobName - Name of the job type
 * @param {object} data - Job payload data
 * @param {object} options - Job options (optional)
 */
export async function addJob(jobName, data, options = {}) {
  console.log(`[addJob] Adding job: ${jobName}`);
  
  try {
    const bossInstance = await getBoss();
    
    // Create queue if it doesn't exist (pg-boss v10 requires this)
    try {
      await bossInstance.createQueue(jobName);
      console.log(`[addJob] Queue '${jobName}' ensured`);
    } catch (createError) {
      // Queue might already exist, that's fine
      console.log(`[addJob] Queue creation: ${createError.message}`);
    }
    
    const jobId = await bossInstance.send(jobName, data, options);
    console.log(`[addJob] Job created with ID: ${jobId}`);
    
    return jobId;
    
  } catch (error) {
    console.error(`[addJob] Error:`, error.message);
    throw error;
  }
}

/**
 * Register a job handler
 * @param {string} jobName - Name of the job type
 * @param {function} handler - Job handler function
 * @param {object} options - Handler options (concurrency, batch size, etc.)
 */
export async function registerJobHandler(jobName, handler, options = {}) {
  const bossInstance = await getBoss();
  
  const defaultOptions = {
    teamSize: 5,        // Number of concurrent jobs
    teamConcurrency: 1, // Jobs per team member
  };

  const handlerOptions = { ...defaultOptions, ...options };
  
  console.log(`Registering job handler: ${jobName}`, handlerOptions);
  
  await bossInstance.work(jobName, handlerOptions, async (jobArray) => {
    // pg-boss v10.3.2 passes jobs as arrays, extract job for ID logging
    const job = jobArray[0];
    
    console.log(`🔧 [registerJobHandler] Processing job: ${jobName} (ID: ${job?.id})`);
    
    try {
      const result = await handler(jobArray);
      console.log(`✅ [registerJobHandler] Job completed successfully: ${jobName} (ID: ${job?.id})`);
      return result;
    } catch (error) {
      console.error(`❌ [registerJobHandler] Job failed: ${jobName} (ID: ${job?.id})`, error);
      throw error; // Re-throw to trigger retry mechanism
    }
  });
  
  console.log(`Job handler registered: ${jobName}`);
}

/**
 * Stop the pg-boss instance
 */
export async function stopBoss() {
  if (boss) {
    console.log('Stopping pg-boss...');
    await boss.stop();
    boss = null;
    console.log('pg-boss stopped');
  }
}

/**
 * Get job statistics
 */
export async function getJobStats() {
  const bossInstance = await getBoss();
  return await bossInstance.getQueueSize();
}

/**
 * Health check for the queue system
 */
export async function healthCheck() {
  try {
    const bossInstance = await getBoss();
    const stats = await bossInstance.getQueueSize();
    return {
      status: 'healthy',
      stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Test function to debug job creation
 */
export async function testJobCreation() {
  console.log(`🎯 [testJobCreation] Starting test...`);
  
  try {
    const testJobData = {
      message: 'Test job for debugging',
      timestamp: new Date().toISOString()
    };
    
    const testJobOptions = {
      retryLimit: 1,
      expireInMinutes: 5
    };
    
    console.log(`🎯 [testJobCreation] Adding test job...`);
    const jobId = await addJob('test_job', testJobData, testJobOptions);
    
    console.log(`🎯 [testJobCreation] Test job result:`, { jobId, type: typeof jobId });
    
    // Check if job exists in database
    const bossInstance = await getBoss();
    const queueSize = await bossInstance.getQueueSize('test_job');
    console.log(`🎯 [testJobCreation] Queue size for test_job:`, queueSize);
    
    return {
      success: !!jobId,
      jobId,
      queueSize
    };
    
  } catch (error) {
    console.error(`❌ [testJobCreation] Test failed:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}