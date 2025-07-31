import { detectParserHandler } from '../../src/jobs/detectParser';
import { Statements } from '../../src/database';
import { getSignedFileUrl } from '../../src/utils/server/s3';
import { detectBestParser } from '../../src/utils/server/parserDetection';

// Mock all dependencies
jest.mock('../../src/database/models', () => ({
  Statements: {
    findByPk: jest.fn(),
  }
}));

jest.mock('../../src/utils/server/s3', () => ({
  getSignedFileUrl: jest.fn()
}));

jest.mock('../../src/utils/server/parserDetection', () => ({
  detectBestParser: jest.fn()
}));

// Mock console methods to avoid noise in tests
const mockConsole = {
  log: jest.fn(),
  error: jest.fn()
};

describe('detectParserHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Override console methods
    global.console = mockConsole;
  });

  afterEach(() => {
    // Restore console
    global.console = require('console');
  });

  const mockJobArray = [{
    id: "d9dc1041-790d-43ff-b154-337633a0dbf9",
    name: "detectParser",
    data: {
      orgId: "TQJccFKqKPN6",
      statementId: "wRkOrqSBX99y"
    },
    expireInSeconds: "900.000000"
  }];

  const mockStatement = {
    id: "wRkOrqSBX99y",
    org: "TQJccFKqKPN6",
    file_name: "test_statement.csv",
    file_type: "csv",
    mime_type: "text/csv",
    location: "statements/test_statement.csv",
    update: jest.fn()
  };

  describe('Happy Path - Successful Parser Detection', () => {
    it('should successfully detect parser and update statement', async () => {
      // Setup mocks
      Statements.findByPk.mockResolvedValue(mockStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.csv');
      
      const mockDetectionResult = {
        success: true,
        bestParser: 'hdfc_bank__csv',
        confidence: 95,
        alternatives: [
          { parser: 'icici_bank__csv', score: 85 },
          { parser: 'sbi_bank__csv', score: 75 }
        ],
        allResults: [
          { parser: 'hdfc_bank__csv', score: 95 },
          { parser: 'icici_bank__csv', score: 85 },
          { parser: 'sbi_bank__csv', score: 75 }
        ],
        error: null
      };
      
      detectBestParser.mockResolvedValue(mockDetectionResult);
      mockStatement.update.mockResolvedValue(true);

      // Execute
      const result = await detectParserHandler(mockJobArray);

      // Verify
      expect(Statements.findByPk).toHaveBeenCalledWith("wRkOrqSBX99y");
      expect(getSignedFileUrl).toHaveBeenCalledWith("statements/test_statement.csv");
      expect(detectBestParser).toHaveBeenCalledWith('https://signed-url.com/file.csv', 'csv');
      
      expect(mockStatement.update).toHaveBeenCalledWith({
        parser_type: 'hdfc_bank__csv',
        checks: {
          parser_detection: {
            completed_at: expect.any(String),
            success: true,
            confidence: 95,
            best_parser: 'hdfc_bank__csv',
            alternatives: mockDetectionResult.alternatives,
            all_results: mockDetectionResult.allResults,
            error: null
          }
        }
      });

      expect(result).toEqual({
        success: true,
        jobId: "d9dc1041-790d-43ff-b154-337633a0dbf9",
        statementId: "wRkOrqSBX99y",
        orgId: "TQJccFKqKPN6",
        fileName: "test_statement.csv",
        alex: "can you see this",
        detectionResult: {
          success: true,
          bestParser: 'hdfc_bank__csv',
          confidence: 95,
          alternatives: 2,
          totalParserstested: 3
        },
        timestamp: expect.any(String)
      });
    });
  });

  describe('Error Cases', () => {
    it('should throw error when statement is not found', async () => {
      Statements.findByPk.mockResolvedValue(null);

      await expect(detectParserHandler(mockJobArray)).rejects.toThrow('Statement not found: wRkOrqSBX99y');
      
      expect(Statements.findByPk).toHaveBeenCalledWith("wRkOrqSBX99y");
      expect(getSignedFileUrl).not.toHaveBeenCalled();
      expect(detectBestParser).not.toHaveBeenCalled();
    });

    it('should throw error when statement does not belong to org', async () => {
      const wrongOrgStatement = { ...mockStatement, org: "DifferentOrgId" };
      Statements.findByPk.mockResolvedValue(wrongOrgStatement);

      await expect(detectParserHandler(mockJobArray)).rejects.toThrow('Statement wRkOrqSBX99y does not belong to org TQJccFKqKPN6');
      
      expect(Statements.findByPk).toHaveBeenCalledWith("wRkOrqSBX99y");
      expect(getSignedFileUrl).not.toHaveBeenCalled();
      expect(detectBestParser).not.toHaveBeenCalled();
    });

    it('should throw error when statement has no file location', async () => {
      const noLocationStatement = { ...mockStatement, location: null };
      Statements.findByPk.mockResolvedValue(noLocationStatement);

      await expect(detectParserHandler(mockJobArray)).rejects.toThrow('No file location found for statement wRkOrqSBX99y');
      
      expect(Statements.findByPk).toHaveBeenCalledWith("wRkOrqSBX99y");
      expect(getSignedFileUrl).not.toHaveBeenCalled();
      expect(detectBestParser).not.toHaveBeenCalled();
    });

    it('should handle parser detection failure and update statement with error', async () => {
      Statements.findByPk.mockResolvedValue(mockStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.csv');
      
      const detectionError = new Error('Parser detection failed');
      detectBestParser.mockRejectedValue(detectionError);
      mockStatement.update.mockResolvedValue(true);

      await expect(detectParserHandler(mockJobArray)).rejects.toThrow('Parser detection failed');
      
      // Should still try to update statement with error
      expect(mockStatement.update).toHaveBeenCalledWith({
        checks: {
          parser_detection: {
            completed_at: expect.any(String),
            success: false,
            error: 'Parser detection failed'
          }
        }
      });
    });

    it('should handle file type detection from mime_type when file_type is missing', async () => {
      const noFileTypeStatement = { 
        ...mockStatement, 
        file_type: null,
        mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      
      Statements.findByPk.mockResolvedValue(noFileTypeStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.xlsx');
      
      const mockDetectionResult = {
        success: true,
        bestParser: 'hdfc_bank__xlsx',
        confidence: 90,
        alternatives: [],
        allResults: [{ parser: 'hdfc_bank__xlsx', score: 90 }],
        error: null
      };
      
      detectBestParser.mockResolvedValue(mockDetectionResult);
      noFileTypeStatement.update = jest.fn().mockResolvedValue(true);

      const result = await detectParserHandler(mockJobArray);

      expect(detectBestParser).toHaveBeenCalledWith('https://signed-url.com/file.xlsx', 'xlsx');
      expect(result.success).toBe(true);
    });

    it('should handle database update errors during error handling', async () => {
      Statements.findByPk.mockResolvedValue(mockStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.csv');
      
      const detectionError = new Error('Parser detection failed');
      detectBestParser.mockRejectedValue(detectionError);
      
      // Mock update to fail twice - once for findByPk in catch block
      Statements.findByPk.mockResolvedValueOnce(mockStatement); // First call
      Statements.findByPk.mockResolvedValueOnce(mockStatement); // Second call in catch block
      mockStatement.update.mockRejectedValue(new Error('Database update failed'));

      await expect(detectParserHandler(mockJobArray)).rejects.toThrow('Parser detection failed');
      
      // Should log the update error
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update statement with error:'),
        expect.any(Error)
      );
    });
  });

  describe('File Type Detection', () => {
    it('should correctly map CSV mime type', async () => {
      const csvStatement = { 
        ...mockStatement, 
        file_type: null,
        mime_type: 'text/csv'
      };
      
      Statements.findByPk.mockResolvedValue(csvStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.csv');
      detectBestParser.mockResolvedValue({
        success: true,
        bestParser: 'test_parser',
        confidence: 80,
        alternatives: [],
        allResults: [],
        error: null
      });
      csvStatement.update = jest.fn().mockResolvedValue(true);

      await detectParserHandler(mockJobArray);

      expect(detectBestParser).toHaveBeenCalledWith('https://signed-url.com/file.csv', 'csv');
    });

    it('should correctly map PDF mime type', async () => {
      const pdfStatement = { 
        ...mockStatement, 
        file_type: null,
        mime_type: 'application/pdf'
      };
      
      Statements.findByPk.mockResolvedValue(pdfStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.pdf');
      detectBestParser.mockResolvedValue({
        success: true,
        bestParser: 'test_parser',
        confidence: 80,
        alternatives: [],
        allResults: [],
        error: null
      });
      pdfStatement.update = jest.fn().mockResolvedValue(true);

      await detectParserHandler(mockJobArray);

      expect(detectBestParser).toHaveBeenCalledWith('https://signed-url.com/file.pdf', 'pdf');
    });

    it('should handle unknown mime type', async () => {
      const unknownStatement = { 
        ...mockStatement, 
        file_type: null,
        mime_type: 'application/unknown'
      };
      
      Statements.findByPk.mockResolvedValue(unknownStatement);
      getSignedFileUrl.mockResolvedValue('https://signed-url.com/file.unknown');
      detectBestParser.mockResolvedValue({
        success: true,
        bestParser: 'test_parser',
        confidence: 80,
        alternatives: [],
        allResults: [],
        error: null
      });
      unknownStatement.update = jest.fn().mockResolvedValue(true);

      await detectParserHandler(mockJobArray);

      expect(detectBestParser).toHaveBeenCalledWith('https://signed-url.com/file.unknown', 'unknown');
    });
  });
});