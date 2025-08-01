import 'server-only';
import { getDB } from "@/database";
import { getSignedFileUrl } from "@/utils/server/s3";
import { readXLSXFiles, readCSVFiles, readPdfFiles } from "@/utils/server/parser";

/**
 * Parse file job handler
 * Extracts data from uploaded statement files and updates the database
 * 
 * @param {Object} job - pg-boss job object
 * @param {Object} job.data - Job payload
 * @param {string} job.data.statementId - Statement ID to process
 * @param {string} job.data.orgId - Organization ID
 * @param {string} job.data.fileType - File type (csv, excel, pdf)
 * @param {string} job.data.fileName - Original file name
 * @param {string} job.data.s3Location - S3 file location
 */
export async function parseFile(job) {
  const { statementId, orgId, fileType, fileName, s3Location } = job.data;
  
  console.log(`Processing file: ${fileName} (${fileType}) for org: ${orgId}`);
  
  try {
    const db = getDB();
    
    // Get the statement record
    const statement = await db.Statements.findByPk(statementId);
    if (!statement) {
      throw new Error(`Statement not found: ${statementId}`);
    }

    // Get signed URL for the file
    const signedUrl = await getSignedFileUrl(s3Location);
    
    let extractedData = null;
    let errors = [];

    // Parse based on file type
    switch (fileType.toLowerCase()) {
      case 'csv':
        try {
          extractedData = await readCSVFiles(signedUrl);
        } catch (error) {
          errors.push(`CSV parsing error: ${error.message}`);
        }
        break;
        
      case 'excel':
      case 'xlsx':
      case 'xls':
        try {
          extractedData = await readXLSXFiles(signedUrl);
        } catch (error) {
          errors.push(`Excel parsing error: ${error.message}`);
        }
        break;
        
      case 'pdf':
        try {
          extractedData = await readPdfFiles(signedUrl);
        } catch (error) {
          errors.push(`PDF parsing error: ${error.message}`);
        }
        break;
        
      default:
        errors.push(`Unsupported file type: ${fileType}`);
    }

    // Update statement with results
    const updateData = {
      status: errors.length > 0 ? 'error' : 'completed',
      extracted_data: extractedData,
      errors: errors.length > 0 ? errors : null,
    };

    await statement.update(updateData);

    console.log(`File processing complete: ${fileName} - ${updateData.status}`);
    
    return {
      statementId,
      status: updateData.status,
      dataCount: extractedData?.length || 0,
      errors: errors.length,
    };

  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error);
    
    // Update statement with error
    try {
      const db = getDB();
      const statement = await db.Statements.findByPk(statementId);
      if (statement) {
        await statement.update({
          status: 'error',
          errors: [error.message],
        });
      }
    } catch (updateError) {
      console.error('Failed to update statement with error:', updateError);
    }
    
    throw error;
  }
}