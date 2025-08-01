import CustomTab from './CustomTab'
import { expect } from 'storybook/test'
/*
=======================
There is an issue with useRouter n useSearchParams, needs to mock them
=======================
*/


//metadata about the component
export default {
  title: 'Components/CustomTab',
  component: CustomTab,
  parameters: {
    nextjs: {
      appDirectory: true, // Enable built-in mocks for next/navigation
    },
  },
  argTypes:{
    tabs: {
      control: 'array',
      description: 'The array of objects to render as a tab'
    },
    variant: {
      control: 'text',
      description: 'The text used for MUI style'
    },
    tabName: {
      control: 'text',
      description: 'This is used for navigating tabs and get active tab'
    }
  }
}

export const Default = {
  args: {
    tabs: [
      { slug: 'tab1', name: 'Tab 1', body: 'Content of Tab 1' },
      { slug: 'tab2', name: 'Tab 2', body: 'Content of Tab 2' },
      { slug: 'tab3', name: 'Tab 3', body: 'Content of Tab 3' },
    ],
    variant: 'plain', 
    tabName: 'tab',
  },
  play: async ({ canvas, userEvent, args }) => {
    // Click Tab 2 and check its content
    await userEvent.click(canvas.getByRole('tab', { name: /tab 2/i }))
    await expect(canvas.getByText('Content of Tab 2')).toBeInTheDocument()

    // Click Tab 3 and check its content
    await userEvent.click(canvas.getByRole('tab', { name: /tab 3/i }))
    await expect(canvas.getByText('Content of Tab 3')).toBeInTheDocument()

    // Click Tab 1 and check its content
    await userEvent.click(canvas.getByRole('tab', { name: /tab 1/i }))
    await expect(canvas.getByText('Content of Tab 1')).toBeInTheDocument()
  }
}

// Manufacturing domain tabs with statistics
export const WithStats = {
  args: {
    tabs: [
      { 
        slug: 'quotes', 
        name: 'Quotes', 
        stats: '47',
        body: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Quotes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-green-700">Approved</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-yellow-600">18</div>
                <div className="text-sm text-yellow-700">Pending Review</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-blue-700">In Progress</div>
              </div>
            </div>
          </div>
        )
      },
      { 
        slug: 'parts', 
        name: 'Parts', 
        stats: '152',
        body: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Part Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-gray-600">89</div>
                <div className="text-sm text-gray-700">Machined Parts</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">34</div>
                <div className="text-sm text-orange-700">Heat Treated</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">19</div>
                <div className="text-sm text-purple-700">Assembly Parts</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">10</div>
                <div className="text-sm text-red-700">Special Process</div>
              </div>
            </div>
          </div>
        )
      },
      { 
        slug: 'processes', 
        name: 'Processes', 
        body: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Manufacturing Processes</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">CNC Machining</span>
                <span className="text-sm text-gray-600">$45.50/hr</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Heat Treatment</span>
                <span className="text-sm text-gray-600">$12.25/kg</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Surface Coating</span>
                <span className="text-sm text-gray-600">$8.75/m²</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Assembly</span>
                <span className="text-sm text-gray-600">$32.00/hr</span>
              </div>
            </div>
          </div>
        )
      },
      { 
        slug: 'activities', 
        name: 'Activities', 
        stats: '24',
        body: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Quote #Q-2024-0089 approved</div>
                  <div className="text-sm text-gray-600">Bearing housing assembly - $2,450.00</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">New part added: Gear Shaft</div>
                  <div className="text-sm text-gray-600">Material: Steel 4140, Heat treated</div>
                  <div className="text-xs text-gray-500">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Process updated: CNC Machining</div>
                  <div className="text-sm text-gray-600">Rate changed from $42.00/hr to $45.50/hr</div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ],
    variant: 'plain',
    tabName: 'section',
  },
  play: async ({ canvas, userEvent }) => {
    // Test that stats badges are visible
    await expect(canvas.getByText('47')).toBeInTheDocument()
    await expect(canvas.getByText('152')).toBeInTheDocument()
    await expect(canvas.getByText('24')).toBeInTheDocument()

    // Click Parts tab and verify stats content
    await userEvent.click(canvas.getByRole('tab', { name: /parts/i }))
    await expect(canvas.getByText('Part Inventory')).toBeInTheDocument()
    await expect(canvas.getByText('89')).toBeInTheDocument()
    await expect(canvas.getByText('Machined Parts')).toBeInTheDocument()

    // Click Processes tab and verify content
    await userEvent.click(canvas.getByRole('tab', { name: /processes/i }))
    await expect(canvas.getByText('Manufacturing Processes')).toBeInTheDocument()
    await expect(canvas.getByText('CNC Machining')).toBeInTheDocument()
    await expect(canvas.getByText('$45.50/hr')).toBeInTheDocument()

    // Click Activities tab and verify content
    await userEvent.click(canvas.getByRole('tab', { name: /activities/i }))
    await expect(canvas.getByText('Recent Activities')).toBeInTheDocument()
    await expect(canvas.getByText('Quote #Q-2024-0089 approved')).toBeInTheDocument()
  }
}