/**
 * Next.js Instrumentation - Handles worker startup based on MODE environment variable
 * 
 * MODE=server  → Web server only
 * MODE=worker  → Worker only (no web server)  
 * MODE=both    → Web server + worker (default)
 */

export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Skip worker initialization during build process
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🏗️  Build phase detected - skipping worker initialization');
      return;
    }
    
    const mode = process.env.MODE || 'both';
    
    console.log(`🚀 Starting Next.js in ${mode} mode`);
    
    if (mode === 'worker') {
      // Worker mode: Start pg-boss worker only
      console.log('📋 Worker mode: Starting pg-boss worker...');
      const { startWorker } = await import('./lib/worker');
      await startWorker();
      
    } else if (mode === 'server') {
      // Server mode: Just web server (default Next.js behavior)
      console.log('🌐 Server mode: Web server only');
      
    } else if (mode === 'both') {
      // Both mode: Web server + worker in same process
      console.log('🔄 Both mode: Starting web server + worker');
      const { startWorker } = await import('./lib/worker');
      await startWorker();
      
    } else {
      console.warn(`⚠️  Unknown MODE: ${mode}. Valid options: server, worker, both`);
    }
  }
}