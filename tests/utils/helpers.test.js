import { formatDate, formatCurrency, getDisplayName, readXLSXFiles, readCSVFiles } from '@/utils/helpers';
import * as XLSX from 'xlsx';
import CSV from 'papaparse';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('formatDate', () => {
  test('formats date correctly with "date" format', () => {
    const date = new Date('2024-03-15');
    expect(formatDate(date, 'date')).toBe('15th Mar, 2024');
  });

  test('formats date correctly with "date-time" format', () => {
    const date = new Date('2024-03-15T14:30:00');
    expect(formatDate(date, 'date-time')).toBe('14:30, 15th Mar');
  });

  test('handles different ordinal suffixes correctly', () => {
    expect(formatDate(new Date('2024-03-01'), 'date')).toBe('1st Mar, 2024');
    expect(formatDate(new Date('2024-03-02'), 'date')).toBe('2nd Mar, 2024');
    expect(formatDate(new Date('2024-03-03'), 'date')).toBe('3rd Mar, 2024');
    expect(formatDate(new Date('2024-03-04'), 'date')).toBe('4th Mar, 2024');
  });
});

describe('formatCurrency', () => {
  test('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('₹1,000.00');
    expect(formatCurrency(1000.5)).toBe('₹1,000.50');
    expect(formatCurrency(1000000)).toBe('₹10,00,000.00');
  });
});


describe('getDisplayName', () => {
  test('formats credit card display names correctly', () => {
    expect(getDisplayName('icici_credit_card', '1234567890123')).toBe('CC ICICI 123');
    expect(getDisplayName('hdfc_credit_card', '9876543210987')).toBe('CC HDFC 987');
  });

  test('formats bank account display names correctly', () => {
    expect(getDisplayName('icici_bank', '1234567890123')).toBe('ICICI XXX 123');
    expect(getDisplayName('hdfc_bank', '9876543210987')).toBe('HDFC XXX 987');
  });

  test('throws error for unknown bank name', () => {
    expect(() => getDisplayName('unknown_bank', '1234567890123')).toThrow('Unknown bank name');
  });
});

describe('readXLSXFiles', () => {
  test('reads XLSX file correctly', async () => {
    // Mock data
    const mockData = [
      ['Header1', 'Header2'],
      ['Value1', 'Value2']
    ];
    
    // Create mock file with arrayBuffer method
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockFile = {
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer)
    };
    
    // Mock XLSX.read and sheet_to_json
    XLSX.read = jest.fn().mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    });
    XLSX.utils.sheet_to_json = jest.fn().mockReturnValue(mockData);

    const result = await readXLSXFiles(mockFile);
    expect(result).toEqual(mockData);
    expect(mockFile.arrayBuffer).toHaveBeenCalled();
  });

  test('handles ArrayBuffer input correctly', async () => {
    const mockData = [
      ['Header1', 'Header2'],
      ['Value1', 'Value2']
    ];
    
    const mockArrayBuffer = new ArrayBuffer(8);
    
    XLSX.read = jest.fn().mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    });
    XLSX.utils.sheet_to_json = jest.fn().mockReturnValue(mockData);

    const result = await readXLSXFiles(mockArrayBuffer);
    expect(result).toEqual(mockData);
  });

  test('handles errors correctly', async () => {
    const mockFile = {
      arrayBuffer: jest.fn().mockRejectedValue(new Error('XLSX read error'))
    };

    await expect(readXLSXFiles(mockFile)).rejects.toThrow('XLSX read error');
  });
});

describe('readCSVFiles', () => {
  test('reads CSV file correctly', async () => {
    // Mock data
    const mockData = [
      ['Header1', 'Header2'],
      ['Value1', 'Value2']
    ];

    // Create mock file with arrayBuffer method
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockFile = {
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer)
    };

    // Mock TextDecoder
    global.TextDecoder = jest.fn().mockImplementation(() => ({
      decode: jest.fn().mockReturnValue('mock,csv,data')
    }));

    // Mock CSV.parse
    CSV.parse = jest.fn().mockReturnValue({ data: mockData });

    const result = await readCSVFiles(mockFile, {});
    expect(result).toEqual(mockData);
    expect(mockFile.arrayBuffer).toHaveBeenCalled();
  });

  test('handles errors correctly', async () => {
    const mockFile = {
      arrayBuffer: jest.fn().mockRejectedValue(new Error('CSV parse error'))
    };

    await expect(readCSVFiles(mockFile)).rejects.toThrow('CSV parse error');
  });
});