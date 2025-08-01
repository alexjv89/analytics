import "server-only";
import { registerJobHandler, getBoss, stopBoss, healthCheck } from "@/lib/queue";
import { parseFile, detectParser } from "@/jobs";

let workerStarted = false;

/**
 * Start the pg-boss worker within Next.js runtime
 * Can be called from instrumentation.js or manually
 */
export async function startWorker() {
  if (workerStarted) {
    console.log("Worker already started, skipping...");
    return;
  }

  try {
    console.log("🔧 Initializing pg-boss worker...");

    // Initialize pg-boss
    const boss = await getBoss();
    console.log("✅ pg-boss initialized successfully");

    // Register job handlers using existing Next.js code
    console.log("📋 Registering job handlers...");

    await registerJobHandler("parse_file", parseFile, {
      teamSize: 1, // Single worker, individual job processing
      teamConcurrency: 1, // One job at a time
    });

    await registerJobHandler("detectParser", detectParser, {
      teamSize: 1, // Single worker, individual job processing
      teamConcurrency: 1, // One job at a time
    });

    console.log("✅ All job handlers registered successfully");

    // Health check
    const health = await healthCheck();
    console.log("🏥 Worker health check:", health);

    console.log("🎯 Worker is running and ready to process jobs!");

    // Handle graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}, shutting down worker gracefully...`);
      try {
        await stopBoss();
        console.log("✅ Worker shutdown complete");
      } catch (error) {
        console.error("❌ Error during worker shutdown:", error);
      }
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGHUP", gracefulShutdown);

    // Log queue statistics periodically (only in worker-only mode)
    if (process.env.MODE === "worker") {
      const statsInterval = setInterval(async () => {
        try {
          const stats = await boss.getQueueSize();
          if (stats > 0) {
            console.log(`📊 Queue stats: ${stats} jobs pending`);
          }
        } catch (error) {
          console.error("❌ Error getting queue stats:", error);
        }
      }, 30000); // Every 30 seconds

      // Clear interval on shutdown
      process.on("SIGTERM", () => clearInterval(statsInterval));
      process.on("SIGINT", () => clearInterval(statsInterval));
    }

    workerStarted = true;
  } catch (error) {
    console.error("❌ Failed to start worker:", error);
    throw error;
  }
}

/**
 * Stop the worker (mainly for testing/cleanup)
 */
export async function stopWorker() {
  if (!workerStarted) {
    return;
  }

  console.log("🛑 Stopping worker...");
  await stopBoss();
  workerStarted = false;
  console.log("✅ Worker stopped");
}
