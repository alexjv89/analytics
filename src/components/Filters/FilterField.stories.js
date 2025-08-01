// Component imports (always first)
import { FilterField } from './FilterField';

// Additional dependencies
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default {
  title: 'Components/Filters/FilterField',
  component: FilterField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `**FilterField** - A form control wrapper that provides consistent labeling and grid layout. Supports full (12 cols), half (6 cols), and third (4 cols) width sizing for flexible layouts.`,
      },
    },
  },
};

export const FilterFieldSizes = {
  render: () => (
    <div className="w-[800px]">
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        <FilterField label="Full Width (12 cols)" size="full">
          <Input placeholder="Full width field..." />
        </FilterField>
        
        <FilterField label="Half Width (6 cols)" size="half">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Half width..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        
        <FilterField label="Another Half (6 cols)" size="half">
          <Input placeholder="Another half..." />
        </FilterField>
        
        <FilterField label="Third Width (4 cols)" size="third">
          <Input placeholder="Third width..." />
        </FilterField>
        
        <FilterField label="Third Width (4 cols)" size="third">
          <Input placeholder="Third width..." />
        </FilterField>
        
        <FilterField label="Third Width (4 cols)" size="third">
          <Input placeholder="Third width..." />
        </FilterField>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FilterField with different size options: full (12 columns), half (6 columns), and third (4 columns) for flexible grid layouts.',
      },
    },
  },
};

export const FilterFieldTypes = {
  render: () => (
    <div className="w-[600px]">
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        <FilterField label="Text Input" size="half">
          <Input placeholder="Type here..." />
        </FilterField>
        
        <FilterField label="Dropdown" size="half">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose option..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        
        <FilterField label="Settings">
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="archived" />
              <Label htmlFor="archived">Include archived items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="recent" />
              <Label htmlFor="recent">Show only recent</Label>
            </div>
          </div>
        </FilterField>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FilterField with various input types including text input, dropdown select, and checkbox groups.',
      },
    },
  },
};