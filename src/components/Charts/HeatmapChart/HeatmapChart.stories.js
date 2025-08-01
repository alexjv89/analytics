// 1. Component import (always first)
import { HeatmapChart } from '../index';

// Mock data for stories
const mockData = [
  {
    "period": "2025-01-01",
    "sum": {
      "inflow": "0",
      "outflow": "10761000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-01-02",
    "sum": {
      "inflow": "648000000",
      "outflow": "500000000"
    },
    "count": {
      "inflow": 2,
      "outflow": 1
    }
  },
  {
    "period": "2025-01-18",
    "sum": {
      "inflow": "0",
      "outflow": "340"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-01-21",
    "sum": {
      "inflow": "0",
      "outflow": "108283000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-01-31",
    "sum": {
      "inflow": "0",
      "outflow": "39700000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-02-01",
    "sum": {
      "inflow": "540000000",
      "outflow": "0"
    },
    "count": {
      "inflow": 1,
      "outflow": 0
    }
  },
  {
    "period": "2025-02-02",
    "sum": {
      "inflow": "0",
      "outflow": "500000000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-02-09",
    "sum": {
      "inflow": "0",
      "outflow": "440000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-02-10",
    "sum": {
      "inflow": "108000000",
      "outflow": "1230"
    },
    "count": {
      "inflow": 1,
      "outflow": 1
    }
  },
  {
    "period": "2025-02-20",
    "sum": {
      "inflow": "0",
      "outflow": "107498000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-02-28",
    "sum": {
      "inflow": "108000000",
      "outflow": "0"
    },
    "count": {
      "inflow": 1,
      "outflow": 0
    }
  },
  {
    "period": "2025-03-02",
    "sum": {
      "inflow": "0",
      "outflow": "148000000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  },
  {
    "period": "2025-03-04",
    "sum": {
      "inflow": "540000000",
      "outflow": "0"
    },
    "count": {
      "inflow": 1,
      "outflow": 0
    }
  },
  {
    "period": "2025-03-05",
    "sum": {
      "inflow": "0",
      "outflow": "400000000"
    },
    "count": {
      "inflow": 0,
      "outflow": 1
    }
  }
];

// Mock the server action for Storybook
jest.mock('./action', () => ({
  getData: jest.fn(() => Promise.resolve({
    status: 'success',
    data: mockData
  }))
}));

export default {
  title: 'Charts/HeatmapChart',
  component: HeatmapChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A calendar heatmap chart that visualizes transaction data over time. Shows transaction counts and amounts with color-coded intensity. Built with ECharts and supports multiple series types.',
      },
    },
    nextjs: {
      appDirectory: true,
      router: {
        pathname: '/orgs/1/accounts/1',
        query: {},
      },
    },
  },
  argTypes: {
    filter: {
      control: { type: 'object' },
      description: 'Filter object containing group_by, accounts, and other filtering options.',
    },
    o_id: {
      control: { type: 'text' },
      description: 'Organization ID for data fetching.',
    },
    compact: {
      control: { type: 'boolean' },
      description: 'Whether to show the chart in compact mode (smaller height, no controls).',
    },
  },
};

export const Default = {
  args: {
    filter: {
      group_by: 'day',
      accounts: '1',
    },
    o_id: '1',
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default heatmap chart showing transaction count data with full controls.',
      },
    },
  },
};

export const Compact = {
  args: {
    filter: {
      group_by: 'day',
      accounts: '1',
    },
    o_id: '1',
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version of the heatmap chart with smaller height and no series selector.',
      },
    },
  },
};

export const DifferentFilters = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Daily Grouping</h3>
        <HeatmapChart 
          filter={{ group_by: 'day', accounts: '1' }} 
          o_id="1" 
          compact={false} 
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Weekly Grouping</h3>
        <HeatmapChart 
          filter={{ group_by: 'week', accounts: '1' }} 
          o_id="1" 
          compact={false} 
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Monthly Grouping</h3>
        <HeatmapChart 
          filter={{ group_by: 'month', accounts: '1' }} 
          o_id="1" 
          compact={false} 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Heatmap charts with different time grouping options (day, week, month).',
      },
    },
  },
};

export const CompactComparison = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Full Size</h3>
        <HeatmapChart 
          filter={{ group_by: 'day', accounts: '1' }} 
          o_id="1" 
          compact={false} 
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Compact Size</h3>
        <HeatmapChart 
          filter={{ group_by: 'day', accounts: '1' }} 
          o_id="1" 
          compact={true} 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of full size vs compact heatmap charts.',
      },
    },
  },
};