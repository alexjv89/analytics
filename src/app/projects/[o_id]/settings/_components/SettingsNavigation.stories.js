import SettingsNavigation from './SettingsNavigation';

/*
 * SettingsNavigation component for sidebar navigation in settings pages.
 * Features responsive navigation items with active state highlighting.
 * Uses Next.js Link components with pathname-based selection logic.
 */

export default {
  title: 'pages/orgs/[o_id]/settings/_components/SettingsNavigation',
  component: SettingsNavigation,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: `
# SettingsNavigation Component

Navigation sidebar component for settings pages with active state management.

## Features
- **Active state detection** using pathname matching
- **Special handling** for main settings route vs sub-routes (including /create pages)
- **Hover effects** with smooth transitions
- **Responsive design** with fixed width sidebar
- **Accessible navigation** using proper Link components

## Navigation Items
- General (main settings page)
- Members (member management)
- API Keys (API key management)

## Usage
\`\`\`jsx
<SettingsNavigation params={{ o_id: 'org-123' }} />
\`\`\`

## Active State Logic
- Main settings (/settings): Only matches exact pathname
- Sub-routes: Matches both base route and /create pages
        `,
      },
    },
  },
  argTypes: {
    params: {
      description: 'Route parameters object containing organization ID',
      control: { type: 'object' },
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ o_id: string }' }
      }
    },
  },
};

// Default story - General settings page selected
export const Default = {
  name: 'General Selected',
  args: {
    params: { o_id: 'org-123' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-123/settings',
      },
    },
    docs: {
      description: {
        story: 'Navigation with General settings page selected (exact match).'
      }
    }
  },
};

// Members page selected
export const MembersSelected = {
  name: 'Members Selected',
  args: {
    params: { o_id: 'org-123' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-123/settings/members',
      },
    },
    docs: {
      description: {
        story: 'Navigation with Members page selected.'
      }
    }
  },
};

// API Keys page selected
export const APIKeysSelected = {
  name: 'API Keys Selected',
  args: {
    params: { o_id: 'org-123' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-123/settings/apikeys',
      },
    },
    docs: {
      description: {
        story: 'Navigation with API Keys page selected.'
      }
    }
  },
};

// Create API Key page (should also highlight API Keys)
export const CreateAPIKeyPage = {
  name: 'Create API Key Page',
  args: {
    params: { o_id: 'org-123' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-123/settings/apikeys/create',
      },
    },
    docs: {
      description: {
        story: 'Navigation when on Create API Key page - API Keys item should be highlighted due to special pathname matching logic.'
      }
    }
  },
};

// Different organization ID
export const DifferentOrganization = {
  name: 'Different Organization',
  args: {
    params: { o_id: 'org-456' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-456/settings/members',
      },
    },
    docs: {
      description: {
        story: 'Navigation for a different organization ID to test dynamic routing.'
      }
    }
  },
};

// No active selection (different page)
export const NoActiveSelection = {
  name: 'No Active Selection',
  args: {
    params: { o_id: 'org-123' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-123/dashboard',
      },
    },
    docs: {
      description: {
        story: 'Navigation when on a different page - no items should be highlighted.'
      }
    }
  },
};

// Hover state demonstration
export const InteractiveDemo = {
  name: 'Interactive Demo',
  args: {
    params: { o_id: 'org-123' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/orgs/org-123/settings',
      },
    },
    docs: {
      description: {
        story: 'Interactive navigation for testing hover states and click behavior. Try hovering over different navigation items.'
      }
    }
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
        <strong>Interactive Demo:</strong> Hover over navigation items to see hover effects. 
        The General item is currently selected based on the mock pathname.
      </div>
      <SettingsNavigation {...args} />
    </div>
  ),
};