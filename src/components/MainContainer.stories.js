// 1. Component import (always first)
import MainContainer from './MainContainer';

export default {
  title: 'components/MainContainer',
  component: MainContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main content container component providing consistent layout structure with flexbox, spacing, and padding. Acts as a wrapper for page content with responsive design.',
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Content to be rendered inside the container',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the container',
    },
  },
};

export const Default = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Page Title</h1>
        <p className="text-gray-600">This is example content within the MainContainer.</p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p>Sample card content</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default MainContainer with sample content showing basic layout structure.',
      },
    },
  },
};

export const WithLongContent = {
  args: {
    children: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive overview of your financial transactions and account balances.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">₹1,25,000</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">₹75,000</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Net Savings</h3>
            <p className="text-2xl font-bold text-blue-600">₹50,000</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">Transaction {i}</p>
                  <p className="text-sm text-gray-500">2024-01-{10 + i}</p>
                </div>
                <span className="font-semibold">₹{(i * 1000).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'MainContainer with realistic financial dashboard content to demonstrate layout with complex nested components.',
      },
    },
  },
};
