import { uploadFileToS3, getSignedFileUrl } from '../../../src/utils/server/s3';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

// Mock the modules
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');
// jest.mock('path');

// Mock fs with promises API
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn().mockImplementation((event, cb) => {
      if (event === 'finish') setTimeout(cb, 0);
      return this;
    }),
  })),
  createReadStream: jest.fn(),
  unlinkSync: jest.fn(),
}));

// jest.mock('uuid', () => ({
//   v4: jest.fn(() => 'mock-uuid')
// }));

describe('S3 Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup environment variables
    process.env.AWS_REGION = 'test-region';
    process.env.AWS_ACCESS_KEY = 'test-key';
    process.env.AWS_ACCESS_SECRET = 'test-secret';
    process.env.AWS_BUCKET = 'test-bucket';
  });

  describe('uploadFileToS3', () => {
    const mockFile = {
      name: 'test.jpg',
      type: 'image/jpeg',
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    };

    beforeEach(() => {
      // Mock fs functions
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockReturnValue(undefined);
      fs.createWriteStream.mockReturnValue({
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn().mockImplementation((event, cb) => {
          if (event === 'finish') cb();
          return this;
        }),
      });
      fs.createReadStream.mockReturnValue('mock-stream');

      // Mock S3 client send
      S3Client.prototype.send = jest.fn().mockResolvedValue({ success: true });
    });

    it('should successfully upload a file to S3', async () => {
      const result = await uploadFileToS3(mockFile);

      expect(result.uploadToS3).toBeDefined();
      expect(result.getPublicUrl.publicUrl).toMatch(/^https:\/\/test-bucket\.s3\.amazonaws\.com\/.+/);
      expect(S3Client.prototype.send).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should clean up local file after upload', async () => {
      const result = await uploadFileToS3(mockFile);

      expect(result.deleteFileFromLocal.success).toBe(true);
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });

  describe('getSignedFileUrl', () => {
    beforeEach(() => {
      // Mock getSignedUrl function
      getSignedUrl.mockImplementation((client, command, options) => {
        return Promise.resolve('https://signed-url.com');
      });
    });

    it('should generate signed URLs for S3 objects with full S3 URL', async () => {
      const location = 'https://test-bucket.s3.amazonaws.com/test.pdf';
      const result = await getSignedFileUrl(location, 'test.pdf');

      expect(result.raw).toBe(location);
      expect(result.inlineUrl).toBe('https://signed-url.com');
      expect(result.downloadUrl).toBe('https://signed-url.com');
      expect(getSignedUrl).toHaveBeenCalledTimes(2);
    });

    it('should generate signed URLs for S3 objects with just the key', async () => {
      const location = 'test.pdf';
      const result = await getSignedFileUrl(location, 'test.pdf');

      expect(result.raw).toBe(location);
      expect(result.inlineUrl).toBe('https://signed-url.com');
      expect(result.downloadUrl).toBe('https://signed-url.com');
      expect(getSignedUrl).toHaveBeenCalledTimes(2);
    });

    it('should handle errors properly', async () => {
      getSignedUrl.mockRejectedValue(new Error('S3 Error'));
      const location = 'test.pdf';

      await expect(getSignedFileUrl(location)).rejects.toThrow('S3 Error');
    });
  });
});
