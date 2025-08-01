// 1. Component import (always first)
import Logo from './Logo';

export default {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The Cashflowy logo component combining the brand icon with text. Supports customizable href for navigation and offering text. Built with shadcn components and Tailwind CSS.',
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  argTypes: {
    offering: {
      control: { type: 'text' },
      description: 'Text to display next to the logo icon. Set to empty string to hide text.',
    },
    href: {
      control: { type: 'text' },
      description: 'URL to navigate to when logo is clicked.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the logo container.',
    },
  },
};

export const Default = {
  args: {
    offering: 'Cashflowy',
    href: '/',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default logo with Cashflowy text and home page link.',
      },
    },
  },
};

export const IconOnly = {
  args: {
    offering: '',
    href: '/',
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo icon only without text, useful for compact layouts.',
      },
    },
  },
};



export const WithCustomStyling = {
  args: {
    offering: 'Cashflowy',
    href: '/',
    className: 'bg-slate-100 p-2 rounded-lg border',
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo with custom background and styling applied.',
      },
    },
  },
};

export const DifferentSizes = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-600 w-24 flex-shrink-0">Small:</span>
        <div className="flex items-center">
          <Logo offering="Cashflowy" className="scale-75 origin-left" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-600 w-24 flex-shrink-0">Normal:</span>
        <div className="flex items-center">
          <Logo offering="Cashflowy" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-600 w-24 flex-shrink-0">Large:</span>
        <div className="flex items-center">
          <Logo offering="Cashflowy" className="scale-125 origin-left" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-600 w-24 flex-shrink-0">Extra Large:</span>
        <div className="flex items-center">
          <Logo offering="Cashflowy" className="scale-150 origin-left" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Logo at different scales to show responsive behavior.',
      },
    },
  },
};
