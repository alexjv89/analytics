// Component imports (always first)
import { FilterContainer } from './FilterContainer';
import { FilterField } from './FilterField';

// Additional dependencies
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default {
  title: 'Components/Filters/FilterContainer',
  component: FilterContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `**FilterContainer** - An accordion-style wrapper that provides a complete filter interface. It includes an expandable/collapsible section with title, form layout using Grid system, and built-in submit/reset buttons with icons. The container handles form submission and reset actions, making it perfect for search and filter UIs throughout the application.`,
      },
    },
  },
  argTypes: {
    onSubmit: { action: 'form submitted' },
    onReset: { action: 'filters reset' },
  },
};

export const FilterContainerBasic = {
  args: {
    title: "Product Filters",
    onSubmit: (e) => {
      e.preventDefault();
      console.log('Form submitted');
    },
    onReset: () => console.log('Filters reset'),
  },
  render: (args) => (
    <div className="w-[600px]">
      <FilterContainer {...args}>
        <FilterField label="Product Name" size="half">
          <Input placeholder="Enter product name..." />
        </FilterField>
        
        <FilterField label="Category" size="half">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="machinery">Machinery</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        
        <FilterField label="Status" size="half">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        
        <FilterField label="Options" size="half">
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="archived-filter" />
              <Label htmlFor="archived-filter">Include archived</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="favorites-filter" />
              <Label htmlFor="favorites-filter">Show favorites only</Label>
            </div>
          </div>
        </FilterField>
      </FilterContainer>
    </div>
  ),
};

// Mobile-friendly responsive layout
export const FilterContainerMobile = {
  args: {
    title: "Mobile Filters",
    defaultExpanded: false,
    onSubmit: (e) => {
      e.preventDefault();
      console.log('Mobile form submitted');
    },
    onReset: () => console.log('Mobile filters reset'),
  },
  render: (args) => (
    <div className="w-[375px] mx-auto overflow-hidden">
      <FilterContainer {...args}>
        <FilterField label="Product Name" size="half">
          <Input placeholder="Enter product name..." />
        </FilterField>
        
        <FilterField label="Category" size="half">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bearings">Bearings</SelectItem>
              <SelectItem value="gears">Gears</SelectItem>
              <SelectItem value="shafts">Shafts</SelectItem>
              <SelectItem value="housings">Housings</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        
        <FilterField label="Status" size="half">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        
        <FilterField label="Price Range" size="half">
          <Input placeholder="$0 - $1000" />
        </FilterField>
        
        <FilterField label="Options" size="full">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="in-stock-mobile" />
              <Label htmlFor="in-stock-mobile" className="text-sm">In stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="on-sale-mobile" />
              <Label htmlFor="on-sale-mobile" className="text-sm">On sale</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="new-mobile" />
              <Label htmlFor="new-mobile" className="text-sm">New items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="featured-mobile" />
              <Label htmlFor="featured-mobile" className="text-sm">Featured</Label>
            </div>
          </div>
        </FilterField>
      </FilterContainer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FilterContainer with defaultExpanded=false, ideal for mobile layouts where filters should be collapsed by default.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};