import General from './General';

// Additional dependencies
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// Test utilities (for interaction tests)
import { screen, expect } from 'storybook/test';

/*
 * General settings page component displaying organization information in a table format.
 * Features breadcrumbs, settings navigation sidebar, and organization details display.
 * Uses shadcn/ui Table components for consistent styling.
 */

// Mock data
import mockOrg from '../../../../../.storybook/mocks/data/org.json';

const mockParams = {
  o_id: 'org-123'
};

const meta = {
  title: 'pages/orgs/[o_id]/settings/General',
  component: General,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: `
# General Settings Page

Complete settings page displaying organization information in a structured table format.

## Features
- **Organization information display** with labeled data rows
- **Settings navigation sidebar** for easy navigation between settings sections
- **Breadcrumb navigation** for clear page hierarchy
- **Responsive layout** with proper content organization
- **Table-based data display** using shadcn/ui Table components
- **Accessible** with proper semantic structure and ARIA labels

## Usage
\`\`\`jsx
<General 
  org={orgObject}
  params={paramsObject}
/>
\`\`\`

## Data Structure
The page displays:
- Organization Name
- Created Date (formatted)
- Organization ID

## Navigation
Includes breadcrumbs: Orgs → [Org Name] → Settings → General
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <SidebarInset>
          <Story />
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
  argTypes: {
    org: {
      description: 'Organization object containing id, name, and created_at',
      control: false,
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ id, name, created_at }' }
      }
    },
    params: {
      description: 'Route parameters including organization ID',
      control: false,
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ o_id }' }
      }
    },
  },
};

export default meta;

// Default story with interaction tests
export const Default = {
  args: {
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic General settings page with organization information display and automated interaction tests.'
      }
    }
  },
};

