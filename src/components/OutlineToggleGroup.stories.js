import { useState } from 'react';
import OutlineToggleGroup from './OutlineToggleGroup';

export default {
  title: 'Components/OutlineToggleGroup',
  component: OutlineToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `OutlineToggleGroup is a toggle component that allows users to switch between different view options. It displays as a connected group of buttons with outline styling, where only one option can be selected at a time.

Key features:
- **Connected buttons** - Buttons are visually connected with shared borders
- **Active state** - Selected option is highlighted with primary colors
- **Flexible options** - Supports any number of options with custom labels
- **Keyboard accessible** - Full keyboard navigation support`,
      },
    },
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['table', 'cards', 'list'],
      description: 'Currently selected value',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when selection changes',
    },
    options: {
      control: 'object',
      description: 'Array of options with value and label properties',
    },
  },
};

export const Default = {
  args: {
    value: 'table',
    options: [
      { value: 'table', label: 'Table' },
      { value: 'cards', label: 'Cards' }
    ],
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <OutlineToggleGroup
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default OutlineToggleGroup with Table and Cards options. Click to switch between views.',
      },
    },
  },
};

export const ThreeOptions = {
  args: {
    value: 'list',
    options: [
      { value: 'table', label: 'Table' },
      { value: 'cards', label: 'Cards' },
      { value: 'list', label: 'List' }
    ],
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <OutlineToggleGroup
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'OutlineToggleGroup with three options showing flexibility for multiple choices.',
      },
    },
  },
};

export const ViewModes = {
  args: {
    value: 'grid',
    options: [
      { value: 'grid', label: 'Grid' },
      { value: 'kanban', label: 'Kanban' },
      { value: 'timeline', label: 'Timeline' },
      { value: 'calendar', label: 'Calendar' }
    ],
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <OutlineToggleGroup
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with four different view modes, demonstrating how the component handles longer labels and more options.',
      },
    },
  },
};

export const Interactive = {
  args: {
    value: 'table',
    options: [
      { value: 'table', label: 'Table' },
      { value: 'cards', label: 'Cards' }
    ],
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div className="space-y-4">
        <OutlineToggleGroup
          {...args}
          value={value}
          onValueChange={setValue}
        />
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-600">
            Selected view: <span className="font-medium">{value}</span>
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing how the selected value changes when clicking different options.',
      },
    },
  },
};