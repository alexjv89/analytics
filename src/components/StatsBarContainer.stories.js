
import StatsBarContainer from './StatsBarContainer';

export default {
  title: 'Components/StatsBarContainer',
  component: StatsBarContainer,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};

// Mock financial data following Cashflowy domain patterns
const mockStats = [
  { type: 'metric', label: 'Total Balance', value: 245000, color: 'success' }, // $2,450.00
  { type: 'divider' },
  { type: 'metric', label: 'Monthly Inflow', value: 850000, color: 'success' }, // $8,500.00
  { type: 'metric', label: 'Monthly Outflow', value: -125000, color: 'warning' }, // -$1,250.00
  { type: 'divider' },
  { type: 'metric', label: 'Net Income', value: 725000, color: 'success' }, // $7,250.00
];

export const Default = {
  args: {
    items: mockStats,
  },
};

export const EmptyState = {
  args: {
    items: [],
  },
};

export const WithAllColors = {
  args: {
    items: [
      { type: 'metric', label: 'Profit', value: 125000, color: 'success' },
      { type: 'metric', label: 'Loss', value: -25000, color: 'danger' },
      { type: 'divider' },
      { type: 'metric', label: 'Pending', value: 15000, color: 'warning' },
      { type: 'metric', label: 'Processed', value: 85000, color: 'neutral' },
    ],
  },
};

export const WithChildren = {
  args: {
    items: [
      { type: 'metric', label: 'Balance', value: 125000, color: 'success' },
      { type: 'divider' },
      { type: 'metric', label: 'Transactions', value: 45 },
    ],
    children: (
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Export
        </button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
          Refresh
        </button>
      </div>
    ),
  },
};

export const WithOverflow = {
  args: {
    items: [
      { type: 'metric', label: 'Account 1', value: 125000, color: 'success' },
      { type: 'metric', label: 'Account 2', value: 85000, color: 'success' },
      { type: 'metric', label: 'Account 3', value: 45000, color: 'success' },
      { type: 'metric', label: 'Account 4', value: 25000, color: 'success' },
      { type: 'divider' },
      { type: 'metric', label: 'Account 5', value: 15000, color: 'success' },
      { type: 'metric', label: 'Account 6', value: 95000, color: 'success' },
      { type: 'metric', label: 'Account 7', value: 65000, color: 'success' },
      { type: 'metric', label: 'Account 8', value: 35000, color: 'success' },
      { type: 'divider' },
      { type: 'metric', label: 'Total', value: 490000, color: 'success' },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates horizontal scrolling behavior when there are many metrics in a narrow container.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 mx-auto bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};