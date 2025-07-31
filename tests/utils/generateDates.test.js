import generateDates from '@/utils/generateDates';
import formatDate from '@/utils/formatDate';

describe('generateDates', () => {
  test('generates daily dates correctly', () => {
    const searchParams = {
      date_from: '2024-01-01',
      date_to: '2024-01-03',
      group_by: 'day'
    };
    
    const result = generateDates(searchParams);
    expect(result).toEqual([
      formatDate.getDayString(new Date('2024-01-01')),
      formatDate.getDayString(new Date('2024-01-02')),
      formatDate.getDayString(new Date('2024-01-03'))
    ]);
  });

  test('generates weekly dates correctly', () => {
    const searchParams = {
      date_from: '2024-01-01',
      date_to: '2024-01-15',
      group_by: 'week'
    };
    
    const result = generateDates(searchParams);
    expect(result).toEqual([
      formatDate.getWeekString(new Date('2024-01-01')),
      formatDate.getWeekString(new Date('2024-01-08')),
      formatDate.getWeekString(new Date('2024-01-15'))
    ]);
  });

  test('generates monthly dates correctly', () => {
    const searchParams = {
      date_from: '2024-01-01',
      date_to: '2024-03-01',
      group_by: 'month'
    };
    
    const result = generateDates(searchParams);
    expect(result).toEqual([
      formatDate.getMonthString(new Date('2024-01-01')),
      formatDate.getMonthString(new Date('2024-02-01')),
      formatDate.getMonthString(new Date('2024-03-01'))
    ]);
  });

  test('generates yearly dates correctly', () => {
    const searchParams = {
      date_from: '2024-01-01',
      date_to: '2026-01-01',
      group_by: 'year'
    };
    
    const result = generateDates(searchParams);
    expect(result).toEqual([
      formatDate.getYearString(new Date('2024-01-01')),
      formatDate.getYearString(new Date('2025-01-01')),
      formatDate.getYearString(new Date('2026-01-01'))
    ]);
  });

  test('handles same start and end date', () => {
    const searchParams = {
      date_from: '2024-01-01',
      date_to: '2024-01-01',
      group_by: 'day'
    };
    
    const result = generateDates(searchParams);
    expect(result).toEqual([
      formatDate.getDayString(new Date('2024-01-01'))
    ]);
  });

  test('returns empty array if start date is after end date', () => {
    const searchParams = {
      date_from: '2024-01-02',
      date_to: '2024-01-01',
      group_by: 'day'
    };
    
    const result = generateDates(searchParams);
    expect(result).toEqual([]);
  });
});
