import { filterTransaction } from '@/utils/server/filter';
import db from '@/database';

// Mock only what's needed for these specific tests
jest.mock('@/database', () => ({
  Sequelize: {
    Op: {
      iLike: 'iLike',
      or: 'or',
      gte: 'gte',
      lte: 'lte'
    }
  }
}));

describe('filterTransaction', () => {
  test('creates basic where clause with org id', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {}
    });
    expect(result).toEqual({
      org: 123
    });
  });

  test('filters by particulars', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: { particulars: 'test' }
    });
    expect(result).toEqual({
      org: 123,
      particulars: {
        [db.Sequelize.Op.iLike]: '%test%'
      }
    });
  });

  test('filters by empty comments', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: { comments: 'empty' }
    });
    expect(result).toEqual({
      org: 123,
      comments: {
        [db.Sequelize.Op.or]: [null, '']
      }
    });
  });

  test('filters by date range', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        date_from: '2024-01-01',
        date_to: '2024-12-31'
      }
    });
    expect(result).toEqual({
      org: 123,
      date: {
        [db.Sequelize.Op.gte]: '2024-01-01',
        [db.Sequelize.Op.lte]: '2024-12-31'
      }
    });
  });

  test('filters by amount range with flow_type all', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        amount_from: '1000',
        amount_to: '5000',
        flow_type: 'all'
      }
    });
    expect(result).toEqual({
      org: 123,
      [db.Sequelize.Op.or]: [
        {
          inflow: {
            [db.Sequelize.Op.gte]: 1000000,
            [db.Sequelize.Op.lte]: 5000000
          }
        },
        {
          outflow: {
            [db.Sequelize.Op.gte]: 1000000,
            [db.Sequelize.Op.lte]: 5000000
          }
        }
      ]
    });
  });

  test('filters by amount range with flow_type inflow', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        amount_from: '1000',
        amount_to: '5000',
        flow_type: 'inflow'
      }
    });
    expect(result).toEqual({
      org: 123,
      inflow: {
        [db.Sequelize.Op.gte]: 1000000,
        [db.Sequelize.Op.lte]: 5000000
      }
    });
  });

  test('filters by amount range with flow_type outflow', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        amount_from: '1000',
        amount_to: '5000',
        flow_type: 'outflow'
      }
    });
    expect(result).toEqual({
      org: 123,
      outflow: {
        [db.Sequelize.Op.gte]: 1000000,
        [db.Sequelize.Op.lte]: 5000000
      }
    });
  });

  test('combines multiple filters', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        particulars: 'test',
        category: 'food',
        accounts: 'acc1,acc2',
        type: 'expense'
      }
    });
    expect(result).toEqual({
      org: 123,
      particulars: {
        [db.Sequelize.Op.iLike]: '%test%'
      },
      category: {
        [db.Sequelize.Op.iLike]: '%food%'
      },
      account: ['acc1', 'acc2'],
      type: 'expense'
    });
  });

  test('handles deprecated inflow range filters', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        inflow_from: '1000',
        inflow_to: '5000'
      }
    });
    expect(result).toEqual({
      org: 123,
      inflow: {
        [db.Sequelize.Op.gte]: 1000000,
        [db.Sequelize.Op.lte]: 5000000
      }
    });
  });

  test('handles deprecated outflow range filters', () => {
    const result = filterTransaction({
      org: { id: 123 },
      searchParams: {
        outflow_from: '1000',
        outflow_to: '5000'
      }
    });
    expect(result).toEqual({
      org: 123,
      outflow: {
        [db.Sequelize.Op.gte]: 1000000,
        [db.Sequelize.Op.lte]: 5000000
      }
    });
  });
});