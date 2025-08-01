import { useState } from 'react';
import TableOrCards from './TableOrCards';

export default {
  title: 'Components/TableOrCards',
  component: TableOrCards,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `TableOrCards is a specialized toggle component designed for switching between table and card view layouts. It's commonly used in data presentation interfaces where users need to choose their preferred visualization format.

This component is a wrapper around OutlineToggleGroup with predefined "Table" and "Cards" options, making it easy to implement consistent view switching across the application.

Common use cases:
- **Data listings** - Switch between detailed table view and visual card view
- **Dashboard components** - Allow users to choose their preferred data format
- **Content management** - Toggle between different content presentation modes`,
      },
    },
  },
  argTypes: {
    viewAs: {
      control: 'select',
      options: ['table', 'cards'],
      description: 'Currently selected view mode',
    },
    setViewAs: {
      action: 'view changed',
      description: 'Callback when view mode changes',
    },
  },
};

export const Default = {
  args: {
    viewAs: 'table',
  },
  render: (args) => {
    const [viewAs, setViewAs] = useState(args.viewAs);
    return (
      <TableOrCards
        viewAs={viewAs}
        setViewAs={setViewAs}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default TableOrCards component starting with table view selected.',
      },
    },
  },
};

export const DefaultCards = {
  args: {
    viewAs: 'cards',
  },
  render: (args) => {
    const [viewAs, setViewAs] = useState(args.viewAs);
    return (
      <TableOrCards
        viewAs={viewAs}
        setViewAs={setViewAs}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'TableOrCards component starting with cards view selected.',
      },
    },
  },
};

export const WithContext = {
  args: {
    viewAs: 'table',
  },
  render: (args) => {
    const [viewAs, setViewAs] = useState(args.viewAs);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Data View</h2>
          <TableOrCards
            viewAs={viewAs}
            setViewAs={setViewAs}
          />
        </div>
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-600">
            Current view mode: <span className="font-medium">{viewAs}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {viewAs === 'table' 
              ? 'Displaying data in a structured table format with columns and rows.'
              : 'Displaying data in a visual card format with individual item cards.'
            }
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'TableOrCards component shown in context with a page header and content area, demonstrating typical usage in a data listing interface.',
      },
    },
  },
};

export const InPageHeader = {
  args: {
    viewAs: 'cards',
  },
  render: (args) => {
    const [viewAs, setViewAs] = useState(args.viewAs);
    return (
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">Statements</h1>
            <p className="text-sm text-gray-600">Manage your financial statements</p>
          </div>
          <div className="flex items-center gap-2">
            <TableOrCards
              viewAs={viewAs}
              setViewAs={setViewAs}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Upload Statement
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viewAs === 'cards' ? (
              <>
                <div className="p-4 border rounded-md bg-white">
                  <h3 className="font-medium">Statement 1</h3>
                  <p className="text-sm text-gray-600">Jan 2024</p>
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h3 className="font-medium">Statement 2</h3>
                  <p className="text-sm text-gray-600">Feb 2024</p>
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h3 className="font-medium">Statement 3</h3>
                  <p className="text-sm text-gray-600">Mar 2024</p>
                </div>
              </>
            ) : (
              <div className="col-span-full">
                <div className="border rounded-md bg-white">
                  <div className="grid grid-cols-3 gap-4 p-2 border-b font-medium text-sm">
                    <div>Name</div>
                    <div>Date</div>
                    <div>Status</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-2 text-sm">
                    <div>Statement 1</div>
                    <div>Jan 2024</div>
                    <div>Processed</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-2 text-sm">
                    <div>Statement 2</div>
                    <div>Feb 2024</div>
                    <div>Processed</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-2 text-sm">
                    <div>Statement 3</div>
                    <div>Mar 2024</div>
                    <div>Processed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing TableOrCards in a realistic page header context, with mock content that changes based on the selected view mode.',
      },
    },
  },
};