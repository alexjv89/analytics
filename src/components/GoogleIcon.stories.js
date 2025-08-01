// 1. Component import (always first)
import GoogleIcon from './GoogleIcon';

export default {
  title: 'components/GoogleIcon',
  component: GoogleIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Google brand icon component using the official Google logo colors. Built with shadcn utilities and supports customizable sizing and styling through className props.',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply. Default size is h-6 w-6 (24px)',
    },
  },
};

export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default Google icon with standard 24px size.',
      },
    },
  },
};

export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <GoogleIcon className="h-4 w-4" />
        <p className="text-xs mt-1">Small (16px)</p>
      </div>
      <div className="text-center">
        <GoogleIcon className="h-6 w-6" />
        <p className="text-xs mt-1">Default (24px)</p>
      </div>
      <div className="text-center">
        <GoogleIcon className="h-8 w-8" />
        <p className="text-xs mt-1">Large (32px)</p>
      </div>
      <div className="text-center">
        <GoogleIcon className="h-12 w-12" />
        <p className="text-xs mt-1">Extra Large (48px)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available sizes showing the icon scales properly.',
      },
    },
  },
};

export const WithCustomStyling = {
  args: {
    className: 'h-10 w-10 opacity-75 hover:opacity-100 transition-opacity',
  },
  parameters: {
    docs: {
      description: {
        story: 'Google icon with custom styling including opacity and hover effects.',
      },
    },
  },
};