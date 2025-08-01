import ListMembers from './ListMembers';
import { addMember, revokeMember } from './action';

// Additional dependencies
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// Test utilities (for interaction tests)
import { screen, userEvent, expect, waitFor } from 'storybook/test';

/*
 * ListMembers settings page component displaying organization members in a table format.
 * Features breadcrumbs, settings navigation sidebar, member management with add/revoke functionality.
 * Uses shadcn/ui components with confirmation dialogs for destructive actions.
 */

// Mock data
import mockOrg from '../../../../../../.storybook/mocks/data/org.json';
import mockMembersData from '../../../../../../.storybook/mocks/data/members.json';

// Filter out members with null users for default stories
const mockMembers = mockMembersData.filter(member => member.user !== null);

const mockParams = {
  o_id: 'org-123'
};

const meta = {
  title: 'pages/orgs/[o_id]/settings/members/ListMembers',
  component: ListMembers,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: `
# Members List Page

Complete settings page for managing organization members with table display and management actions.

## Features
- **Members table display** with name, email, access level, and actions
- **Add new member button** with modal dialog for email invitation
- **Revoke member functionality** with confirmation dialog
- **Access level badges** with color-coded display (admin/member)
- **Settings navigation sidebar** for easy navigation between settings sections
- **Breadcrumb navigation** for clear page hierarchy
- **Responsive layout** with proper content organization

## Usage
\`\`\`jsx
<ListMembers 
  members={membersArray}
  org={orgObject}
  params={paramsObject}
/>
\`\`\`

## Member Management
- View all members in a structured table
- Add new members via email invitation
- Revoke member access with confirmation
- Visual access level indicators

## Navigation
Includes breadcrumbs: Orgs → [Org Name] → Settings → Members
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
    members: {
      description: 'Array of member objects with id, access, and user details',
      control: false,
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: '[{ id, access, user: { name, email } }]' }
      }
    },
    org: {
      description: 'Projects object containing id and name',
      control: false,
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ id, name }' }
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

// Default story with members
export const Default = {
  args: {
    members: mockMembers,
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic Members list page with multiple members and automated interaction tests.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Verify page header and navigation', async () => {
      await expect(screen.getByRole('heading', { name: /members/i })).toBeInTheDocument();
      await expect(screen.getByRole('button', { name: /add member/i })).toBeInTheDocument();
    });
    
    await step('Verify members table display', async () => {
      // Check table headers using columnheader role for better specificity
      await expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
      await expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
      await expect(screen.getByRole('columnheader', { name: /access/i })).toBeInTheDocument();
      await expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
      
      // Check member data
      await expect(screen.getByText('John Doe')).toBeInTheDocument();
      await expect(screen.getByText('john.doe@cashflowy.com')).toBeInTheDocument();
      await expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      await expect(screen.getByText('jane.smith@cashflowy.com')).toBeInTheDocument();
    });
    
    await step('Verify access level badges', async () => {
      // Check for admin and member badges
      const adminBadges = screen.getAllByText('admin');
      const memberBadges = screen.getAllByText('member');
      
      await expect(adminBadges.length).toBeGreaterThan(0);
      await expect(memberBadges.length).toBeGreaterThan(0);
    });
    
    await step('Verify revoke buttons are present', async () => {
      const revokeButtons = screen.getAllByRole('button', { name: /revoke/i });
      await expect(revokeButtons).toHaveLength(4); // One for each member (filtered to valid users)
    });
    
    await step('Test add member dialog', async () => {
      // Click add member button
      const addButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(addButton);
      
      // Verify add member dialog opens
      await expect(screen.getByRole('dialog')).toBeInTheDocument();
      await expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      
      // Close dialog
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
  },
};

// Empty state story
export const EmptyState = {
  name: 'No Members',
  args: {
    members: [],
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests the component when no members exist in the organization.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Verify empty table structure', async () => {
      // Headers should still be present
      await expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
      await expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
      await expect(screen.getByRole('columnheader', { name: /access/i })).toBeInTheDocument();
      await expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
      
      // But no member data
      expect(screen.queryByText('john.doe@cashflowy.com')).not.toBeInTheDocument();
    });
    
    await step('Verify add button is still available', async () => {
      await expect(screen.getByRole('button', { name: /add member/i })).toBeInTheDocument();
    });
  },
};

// Single member story
export const SingleMember = {
  name: 'Single Member',
  args: {
    members: [mockMembers[0]],
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests the component with only one member.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Verify single member display', async () => {
      await expect(screen.getByText('John Doe')).toBeInTheDocument();
      await expect(screen.getByText('john.doe@cashflowy.com')).toBeInTheDocument();
      await expect(screen.getByText('admin')).toBeInTheDocument();
      
      // Should show table with single row
      const revokeButtons = screen.getAllByRole('button', { name: /revoke/i });
      await expect(revokeButtons).toHaveLength(1);
    });
  },
};

// Add member interaction
export const AddMemberFlow = {
  name: 'Add Member Flow',
  args: {
    members: mockMembers,
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests the complete add member flow with form submission and validation.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Test successful member addition', async () => {
      // Clear previous mock calls
      addMember.mockClear();
      
      // Click add member button
      const addButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(addButton);
      
      // Fill in email
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'newuser@acme.com');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(submitButton);
      
      // Verify addMember was called
      await waitFor(() => {
        expect(addMember).toHaveBeenCalledTimes(1);
        expect(addMember).toHaveBeenCalledWith({
          formData: expect.any(FormData),
          params: mockParams
        });
      }, { timeout: 2000 });
    });
  },
};

// Revoke member interaction
export const RevokeMemberFlow = {
  name: 'Revoke Member Flow',
  args: {
    members: [mockMembers[0]],
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests the complete revoke member flow with confirmation dialog.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Test member revocation confirmation', async () => {
      // Set up revoke mock implementation
      revokeMember.mockClear();
      revokeMember.mockImplementation(async ({ formData, params }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: 'Member access revoked successfully',
          membership: formData.get('membership')
        };
      });
      
      // Click revoke button
      const revokeButton = screen.getByRole('button', { name: /revoke/i });
      await userEvent.click(revokeButton);
      
      // Verify confirmation dialog
      await expect(screen.getByText('Please confirm')).toBeInTheDocument();
      // Look for email in dialog context specifically
      const dialog = screen.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      await expect(screen.getByText(/revoke access for/i)).toBeInTheDocument();
      
      // Test cancel first
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Open dialog again and confirm
      await userEvent.click(revokeButton);
      const confirmButton = screen.getByRole('button', { name: /yes, revoke access/i });
      await userEvent.click(confirmButton);
      
      // Verify revokeMember was called
      await waitFor(() => {
        expect(revokeMember).toHaveBeenCalledTimes(1);
        expect(revokeMember).toHaveBeenCalledWith({
          formData: expect.any(FormData),
          params: mockParams
        });
      }, { timeout: 2000 });
    });
  },
};

// Different access levels
export const DifferentAccessLevels = {
  name: 'Mixed Access Levels',
  args: {
    members: [
      { ...mockMembers[0], access: 'admin' },
      { ...mockMembers[1], access: 'member' },
      { ...mockMembers[2], access: 'viewer' },
    ],
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests the component with members having different access levels.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Verify different access level badges', async () => {
      await expect(screen.getByText('admin')).toBeInTheDocument();
      await expect(screen.getByText('member')).toBeInTheDocument();
      await expect(screen.getByText('viewer')).toBeInTheDocument();
    });
  },
};

// Accessibility testing
export const AccessibilityTesting = {
  name: 'Accessibility Features',
  args: {
    members: mockMembers,
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests accessibility features including keyboard navigation, ARIA labels, and screen reader support.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Test semantic structure and navigation', async () => {
      // Verify main heading
      const heading = screen.getByRole('heading', { name: /members/i });
      await expect(heading).toBeInTheDocument();
      
      // Verify table accessibility
      const table = screen.getByRole('table');
      await expect(table).toBeInTheDocument();
      
      // Verify all action buttons are accessible
      const revokeButtons = screen.getAllByRole('button', { name: /revoke/i });
      await expect(revokeButtons).toHaveLength(4); // Updated to match actual mock data
      
      const addButton = screen.getByRole('button', { name: /add member/i });
      await expect(addButton).toBeInTheDocument();
    });
    
    await step('Test keyboard navigation', async () => {
      // Test add member button keyboard interaction
      const addButton = screen.getByRole('button', { name: /add member/i });
      addButton.focus();
      await expect(addButton).toHaveFocus();
      
      // Test keyboard activation
      await userEvent.keyboard('{Enter}');
      await expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Test tab navigation in dialog
      const emailInput = screen.getByLabelText(/email/i);
      await expect(emailInput).toHaveFocus();
      
      await userEvent.keyboard('{Tab}');
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await expect(cancelButton).toHaveFocus();
      
      // Close dialog
      await userEvent.keyboard('{Enter}');
      
      // Wait for dialog to close completely
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    await step('Test table accessibility', async () => {
      // Verify table headers are properly associated
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      const emailHeader = screen.getByRole('columnheader', { name: /email/i });
      const accessHeader = screen.getByRole('columnheader', { name: /access/i });
      const actionsHeader = screen.getByRole('columnheader', { name: /actions/i });
      
      await expect(nameHeader).toBeInTheDocument();
      await expect(emailHeader).toBeInTheDocument();
      await expect(accessHeader).toBeInTheDocument();
      await expect(actionsHeader).toBeInTheDocument();
    });
  },
};

// Mobile responsive testing
export const MobileView = {
  name: 'Mobile Responsive Test',
  args: {
    members: mockMembers.slice(0, 2), // Fewer items for mobile testing
    org: {
      id: 'mobile-test',
      name: 'Mobile Test Corp'
    },
    params: { o_id: 'mobile-test' },
  },
  globals: {
    viewport: { value: 'iphone5', isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests mobile responsive behavior and table adaptation.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Test mobile layout and functionality', async () => {
      // Verify content is accessible on mobile
      await expect(screen.getByRole('heading', { name: /members/i })).toBeInTheDocument();
      await expect(screen.getByRole('button', { name: /add member/i })).toBeInTheDocument();
      
      // Verify table renders on mobile
      const table = screen.getByRole('table');
      await expect(table).toBeInTheDocument();
      
      // Test mobile add member interaction
      const addButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(addButton);
      await expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Test email input on mobile
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'mobile@test.com');
      await expect(emailInput).toHaveValue('mobile@test.com');
      
      // Close dialog
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
    });
  },
};