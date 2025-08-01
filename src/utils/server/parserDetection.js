import 'server-only';
import { readdirSync } from 'fs';
import path from 'path';

/**
 * Parser Detection Utility
 * Automatically detects the best parser for uploaded files
 */

/**
 * Get all available parsers from the parser directory
 * @returns {Array} Array of parser names (without .js extension)
 */
export function getAllParsers() {
  try {
    const parserDir = path.join(process.cwd(), 'src', 'parser');
    const files = readdirSync(parserDir);
    
    return files
      .filter(file => file.endsWith('.js'))
      .map(file => file.replace('.js', ''));
  } catch (error) {
    console.error('Error reading parser directory:', error);
    return [];
  }
}

/**
 * Group parsers by file type based on naming convention
 * @param {Array} parsers - Array of parser names
 * @returns {Object} Grouped parsers by file type
 */
export function groupParsersByFileType(parsers) {
  const grouped = {
    csv: [],
    excel: [],
    pdf: [],
    unknown: []
  };

  parsers.forEach(parser => {
    const lowerParser = parser.toLowerCase();
    if (lowerParser.includes('__csv')) {
      grouped.csv.push(parser);
    } else if (lowerParser.includes('__xlsx') || lowerParser.includes('__excel')) {
      grouped.excel.push(parser);
    } else if (lowerParser.includes('__pdf')) {
      grouped.pdf.push(parser);
    } else {
      grouped.unknown.push(parser);
    }
  });

  return grouped;
}


/**
 * Test a single parser against file data
 * @param {string} parserName - Name of the parser to test
 * @param {Array} rawData - Raw file data
 * @returns {Promise<Object>} Test result with score and details
 */
export async function testParser(parserName, rawData) {
  const result = {
    parser: parserName,
    score: 0,
    valid: false,
    error: null,
    transactions: [],
    metadata: null,
    metrics: {
      transactionCount: 0,
      validDates: 0,
      validAmounts: 0,
      hasMetadata: false
    }
  };

  try {
    // Dynamic import of the parser
    const parserModule = await import(`@/parser/${parserName}`);
    
    // Test isValid function
    if (typeof parserModule.isValid === 'function') {
      result.valid = parserModule.isValid(rawData);
      
      if (!result.valid) {
        result.score = 0;
        return result;
      }
    }

    // Test parseFile function
    if (typeof parserModule.parseFile === 'function') {
      // Create a mock file object for testing
      const mockFile = {
        data: rawData,
        type: 'test'
      };

      const parseResult = await parserModule.parseFile(mockFile);
      
      if (parseResult && parseResult.transactions) {
        result.transactions = parseResult.transactions;
        result.metadata = parseResult.metadata;
        
        // Calculate metrics
        result.metrics = calculateParserMetrics(parseResult.transactions, parseResult.metadata);
        
        // Calculate score based on metrics
        result.score = calculateParserScore(result.metrics);
      }
    }

  } catch (error) {
    result.error = error.message;
    result.score = 0;
  }

  return result;
}

/**
 * Calculate metrics for parser results
 * @param {Array} transactions - Extracted transactions
 * @param {Object} metadata - Extracted metadata
 * @returns {Object} Calculated metrics
 */
function calculateParserMetrics(transactions = [], metadata = null) {
  const metrics = {
    transactionCount: transactions.length,
    validDates: 0,
    validAmounts: 0,
    hasMetadata: !!metadata
  };

  transactions.forEach(transaction => {
    // Check for valid dates
    if (transaction.date && !isNaN(Date.parse(transaction.date))) {
      metrics.validDates++;
    }

    // Check for valid amounts (inflow or outflow)
    if ((transaction.inflow && !isNaN(transaction.inflow)) || 
        (transaction.outflow && !isNaN(transaction.outflow))) {
      metrics.validAmounts++;
    }
  });

  return metrics;
}

/**
 * Calculate score for parser results
 * @param {Object} metrics - Parser metrics
 * @returns {number} Score between 0-100
 */
function calculateParserScore(metrics) {
  let score = 0;

  // Base score for having transactions
  if (metrics.transactionCount > 0) {
    score += 30;
  }

  // Score for transaction count (up to 20 points)
  score += Math.min(20, metrics.transactionCount * 2);

  // Score for valid dates (up to 25 points)
  if (metrics.transactionCount > 0) {
    const dateRatio = metrics.validDates / metrics.transactionCount;
    score += dateRatio * 25;
  }

  // Score for valid amounts (up to 20 points)
  if (metrics.transactionCount > 0) {
    const amountRatio = metrics.validAmounts / metrics.transactionCount;
    score += amountRatio * 20;
  }

  // Bonus for metadata (5 points)
  if (metrics.hasMetadata) {
    score += 5;
  }

  return Math.round(Math.min(100, score));
}

/**
 * Detect the best parser for a statement
 * @param {Object} statement - Statement object with extracted_data
 * @returns {Promise<Object>} Detection result with best parser and alternatives
 */
export async function detectBestParser(statement) {
  const result = {
    success: false,
    bestParser: null,
    confidence: 0,
    alternatives: [],
    error: null,
    allResults: []
  };

  try {
    // Use raw data from statement.extracted_data
    if (!statement.extracted_data?.raw) 
      throw new Error('No raw data found in statement.extracted_data');

    console.log(`Starting parser detection for statement: ${statement.file_name}`);
    
    // Get all parsers and filter by file type
    const allParsers = getAllParsers();
    const groupedParsers = groupParsersByFileType(allParsers);
    
    
    // Get compatible parsers for this file type
    let compatibleParsers = [];
    compatibleParsers = groupedParsers[statement.file_type]
    

    console.log(`Testing ${compatibleParsers.length} compatible parsers:`, compatibleParsers);

    // Test all compatible parsers
    const testPromises = compatibleParsers.map(parser => 
      testParser(parser, statement.extracted_data.raw).catch(error => ({
        parser,
        score: 0,
        valid: false,
        error: error.message,
        transactions: [],
        metadata: null,
        metrics: { transactionCount: 0, validDates: 0, validAmounts: 0, hasMetadata: false }
      }))
    );

    const testResults = await Promise.all(testPromises);
    result.allResults = testResults;

    // Sort by score (highest first)
    const sortedResults = testResults
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    if (sortedResults.length > 0) {
      result.success = true;
      result.bestParser = sortedResults[0].parser;
      result.confidence = sortedResults[0].score;
      result.alternatives = sortedResults.slice(1, 4); // Top 3 alternatives
      
      console.log(`Best parser detected: ${result.bestParser} (confidence: ${result.confidence}%)`);
    } else {
      result.error = 'No compatible parser found for this file';
      console.log('No compatible parser found');
    }

  } catch (error) {
    result.error = error.message;
    console.error('Parser detection error:', error);
  }

  return result;
}
