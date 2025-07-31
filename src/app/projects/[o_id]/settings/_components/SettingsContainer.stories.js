// Component imports (always first)
import SettingsContainer from './SettingsContainer';

// Additional dependencies
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsNavigation from './SettingsNavigation';

/*
 * SettingsContainer component providing a two-column layout for settings pages.
 * Features a flexible sidebar (columnOne) and main content area (columnTwo) with responsive spacing.
 * Commonly used with SettingsNavigation in columnOne and forms/tables in columnTwo.
 */

export default {
  title: 'pages/orgs/[o_id]/settings/_components/SettingsContainer',
  component: SettingsContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# SettingsContainer Component

A two-column layout container for settings pages. Provides a flexible sidebar (columnOne) and main content area (columnTwo) with responsive spacing.

## Features
- **Two-column flex layout** with proper spacing
- **Flexible sidebar** that maintains fixed width for navigation
- **Responsive main content** area that expands to fill available space
- **Consistent gap** between columns
- **Maximum width constraint** on main content for optimal readability

## Usage
\`\`\`jsx
<SettingsContainer
  columnOne={<SettingsNavigation params={params} />}
  columnTwo={<YourSettingsContent />}
/>
\`\`\`

## Layout Structure
- **columnOne**: Sidebar area (navigation, filters, etc.) - fixed width
- **columnTwo**: Main content area (forms, tables, etc.) - flexible width with max constraint
        `,
      },
    },
  },
  argTypes: {
    columnOne: {
      control: false,
      description: 'Content for the left sidebar column (navigation, filters, etc.)',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' }
      }
    },
    columnTwo: {
      control: false,
      description: 'Content for the main content area (forms, tables, etc.)',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' }
      }
    },
  },
};

// Basic example with placeholder content
export const Basic = {
  name: 'Basic Layout',
  args: {
    columnOne: (
      <Card className="w-48 bg-gray-50">
        <CardContent className="text-center p-4">
          <Typography className="font-medium text-blue-600">columnOne</Typography>
          <Typography className="text-sm text-gray-600 mt-1">
            Sidebar content goes here (navigation, filters, etc.)
          </Typography>
        </CardContent>
      </Card>
    ),
    columnTwo: (
      <Card className="bg-gray-100 h-[400px]">
        <CardContent className="text-center h-full flex flex-col justify-center">
          <Typography className="font-medium text-blue-600">columnTwo</Typography>
          <Typography className="text-sm text-gray-600 mt-1">
            Main content area (forms, tables, settings panels, etc.)
          </Typography>
        </CardContent>
      </Card>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic two-column layout with placeholder content showing the structure and spacing.'
      }
    }
  },
};

// Realistic example with SettingsNavigation
export const WithSettingsNavigation = {
  name: 'With Settings Navigation',
  args: {
    columnOne: (
      <SettingsNavigation params={{ o_id: 'org-123' }} />
    ),
    columnTwo: (
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Manage your organization&apos;s general settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input id="org-name" value="Cashflowy Demo Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-description">Description</Label>
            <Input id="org-description" placeholder="Enter organization description..." />
          </div>
          <div className="flex gap-2">
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    ),
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
        story: 'Realistic example with SettingsNavigation in columnOne and a settings form in columnTwo.'
      }
    }
  },
};

// Example with table content
export const WithTableContent = {
  name: 'With Table Content',
  args: {
    columnOne: (
      <SettingsNavigation params={{ o_id: 'org-123' }} />
    ),
    columnTwo: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-lg font-semibold">API Keys</Typography>
            <Typography className="text-sm text-gray-600">
              Manage your organization&apos;s API keys for external integrations.
            </Typography>
          </div>
          <Button>Create New API Key</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="border rounded-lg">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b font-medium text-sm">
                <div>Name</div>
                <div>Key</div>
                <div>Created</div>
                <div>Actions</div>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4 border-b">
                <div>Production API</div>
                <div className="font-mono text-sm">cf_app_prod123...</div>
                <div>2 days ago</div>
                <div>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4">
                <div>Development API</div>
                <div className="font-mono text-sm">cf_app_dev456...</div>
                <div>1 week ago</div>
                <div>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
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
        story: 'Example with API Keys table content showing how the container handles different content types.'
      }
    }
  },
};

// Content overflow example
export const ContentOverflow = {
  name: 'Content Overflow Handling',
  args: {
    columnOne: (
      <SettingsNavigation params={{ o_id: 'org-123' }} />
    ),
    columnTwo: (
      <Card>
        <CardHeader>
          <CardTitle>Long Content Example</CardTitle>
          <CardDescription>
            This example shows how the container handles content that exceeds the viewport height.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Generate multiple sections to demonstrate overflow */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-4 border rounded">
              <Typography className="font-medium">Section {i + 1}</Typography>
              <Typography className="text-sm text-gray-600 mt-1">
                This is a content section to demonstrate how the container handles 
                long content that might extend beyond the viewport height. The container 
                should allow natural scrolling while maintaining the layout structure.
              </Typography>
              <div className="mt-2 space-y-2">
                <Input placeholder={`Input field ${i + 1}A`} />
                <Input placeholder={`Input field ${i + 1}B`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    ),
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
        story: 'Demonstrates how the container handles content overflow and long content that extends beyond viewport height.'
      }
    }
  },
};

// Empty state example
export const EmptyStates = {
  name: 'Empty States',
  args: {
    columnOne: null,
    columnTwo: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Container with empty/null columns to test graceful handling of missing content.'
      }
    }
  },
};

// Single column usage
export const SingleColumn = {
  name: 'Single Column Usage',
  args: {
    columnOne: null,
    columnTwo: (
      <Card>
        <CardHeader>
          <CardTitle>Full Width Content</CardTitle>
          <CardDescription>
            Example of using the container with only columnTwo content for full-width layouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Typography className="text-gray-600">
            This demonstrates how the container behaves when only one column has content.
            The content should still be properly positioned and styled.
          </Typography>
        </CardContent>
      </Card>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using the container with only one column populated.'
      }
    }
  },
};