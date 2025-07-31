import {
  getDayString,
  getWeekString,
  getMonthString,
  getYearString,
  getDateString,
  getPeriodString
} from '@/utils/formatDate';

describe('formatDate utils', () => {
  // Test date: January 15, 2024
  // const testDate = new Date(2024, 0, 15);
  const testDate = new Date('2024-01-15');
  const testDateString = '2024-01-15T00:00:00.000Z';

  describe('getDayString', () => {
    it('should format Date object correctly', () => {
      expect(getDayString(testDate)).toBe('2024-01-15');
    });

    it('should handle date string input', () => {
      expect(getDayString(testDateString)).toBe('2024-01-15');
    });
  });

  describe('getWeekString', () => {
    it('should format Date object correctly', () => {
      expect(getWeekString(testDate)).toBe('2024-W03');
    });

    it('should handle date string input', () => {
      expect(getWeekString(testDateString)).toBe('2024-W03');
    });
  });

  describe('getMonthString', () => {
    it('should format Date object correctly', () => {
      expect(getMonthString(testDate)).toBe('2024-01');
    });

    it('should handle date string input', () => {
      expect(getMonthString(testDateString)).toBe('2024-01');
    });
  });

  describe('getYearString', () => {
    it('should format Date object correctly', () => {
      expect(getYearString(testDate)).toBe('2024');
    });

    it('should handle date string input', () => {
      expect(getYearString(testDateString)).toBe('2024');
    });
  });

  describe('getDateString', () => {
    it('should return day format by default', () => {
      expect(getDateString(testDate)).toBe('2024-01-15');
    });

    it('should handle different period formats', () => {
      expect(getDateString(testDate, 'day')).toBe('2024-01-15');
      expect(getDateString(testDate, 'week')).toBe('2024-W03');
      expect(getDateString(testDate, 'month')).toBe('2024-01');
      expect(getDateString(testDate, 'year')).toBe('2024');
    });
  });

  describe('getPeriodString', () => {
    it('should return day format by default', () => {
      expect(getPeriodString(testDate)).toBe('2024-01-15');
    });

    it('should handle different group_by formats', () => {
      expect(getPeriodString(testDate, 'day')).toBe('2024-01-15');
      expect(getPeriodString(testDate, 'week')).toBe('2024-W03');
      expect(getPeriodString(testDate, 'month')).toBe('2024-01');
      expect(getPeriodString(testDate, 'year')).toBe('2024');
    });
  });
});