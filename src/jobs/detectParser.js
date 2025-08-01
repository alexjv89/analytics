import 'server-only';
import { getDB } from "@/database";
import { getSignedFileUrl } from "@/utils/server/s3";
import { detectBestParser } from "@/utils/server/parserDetection";

/**
 * Parser detection job handler
 * Automatically detects the best parser for uploaded statement files
 * 
 * @param {Array} jobArray - pg-boss job array (v10.3.2 always passes arrays)
 * @param {Object} jobArray[0].data - Job payload
 * @param {string} jobArray[0].data.statement_id - Statement ID to process
 * @param {string} jobArray[0].data.org_id - Organization ID
 */
export async function detectParser(jobArray) {
  // pg-boss v10.3.2 always passes jobs as arrays, extract the job object
  const job = jobArray[0];
  const { statement_id, org_id } = job.data;
  
  console.log(`🔍 [detectParser] Starting parser detection for statement: ${statement_id}`);
  console.log(`📝 [detectParser] Job ID: ${job.id}`);
  console.log(`🏢 [detectParser] Org ID: ${org_id}`);
  
  try {
    const db = getDB();
    
    // Get the statement record from database
    const statement = await db.Statements.findByPk(statement_id);
    if (!statement) 
      throw new Error(`Statement not found: ${statement_id}`);


    // Verify statement belongs to the org
    if (statement.org !== org_id) 
      throw new Error(`Statement ${statement_id} does not belong to org ${org_id}`);
    

    // Get signed URL for the file
    console.log(`🔗 [detectParser] Getting signed URL for: ${statement.location}`);
    statement.location = await getSignedFileUrl(statement.location);
    


    // Run parser detection
    console.log(`🧪 [detectParser] Starting parser detection...`);
    const detectionResult = await detectBestParser(statement);

    console.log(`🎉 [detectParser] Detection complete!`);
    console.log(`📊 [detectParser] Success: ${detectionResult.success}`);
    console.log(`🏆 [detectParser] Best parser: ${detectionResult.bestParser}`);
    console.log(`🎯 [detectParser] Confidence: ${detectionResult.confidence}%`);

    // Update statement with detection results
    const updateData = {
      parser_type: detectionResult.bestParser,
      checks: {
        parser_detection: {
          completed_at: new Date().toISOString(),
          success: detectionResult.success,
          confidence: detectionResult.confidence,
          best_parser: detectionResult.bestParser,
          alternatives: detectionResult.alternatives,
          all_results: detectionResult.allResults,
          error: detectionResult.error
        }
      }
    };

    await statement.update(updateData);
    console.log(`✅ [detectParser] Statement updated with detection results`);

    // Return comprehensive result
    return {
      success: true,
      jobId: job.id,
      statement_id,
      org_id,
      fileName: statement.file_name,
      detectionResult: {
        success: detectionResult.success,
        bestParser: detectionResult.bestParser,
        confidence: detectionResult.confidence,
        alternatives: detectionResult.alternatives.length,
        totalParserstested: detectionResult.allResults.length
      },
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ [detectParser] Error:`, error.message);
    console.error(`❌ [detectParser] Stack:`, error.stack);
    
    // Try to update statement with error
    try {
      const db = getDB();
      const statement = await db.Statements.findByPk(statement_id);
      if (statement) {
        await statement.update({
          checks: {
            parser_detection: {
              completed_at: new Date().toISOString(),
              success: false,
              error: error.message
            }
          }
        });
      }
    } catch (updateError) {
      console.error(`❌ [detectParser] Failed to update statement with error:`, updateError);
    }
    
    // Re-throw error so pg-boss can handle retries
    throw error;
  }
}