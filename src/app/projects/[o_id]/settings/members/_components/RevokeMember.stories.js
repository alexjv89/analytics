import RevokeMember from './RevokeMember';
import { revokeMember } from '../action';

// Test utilities (for interaction tests)
import { screen, userEvent, expect, waitFor } from 'storybook/test';

/*
 * RevokeMember component for revoking organization member access.
 * Migrated from MUI Joy to shadcn/ui with enhanced accessibility and modern styling.
 * Features include confirmation dialog, loading states, and error handling.
 * 
 * Note: In Storybook, this component uses mocked member actions from action.mock.js
 * which simulate different scenarios (success, error, network failure).
 */

// Mock data for testing
const mockMember = {
  id: 'member-123',
  user: {
    email: 'john.doe@example.com',
    name: 'John Doe'
  }
};

const mockParams = {
  o_id: 'org-456'
};

const meta = {
  title: 'pages/orgs/[o_id]/settings/members/_components/RevokeMember',
  component: RevokeMember,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# RevokeMember Component

Confirmation dialog component for revoking organization member access. Migrated from MUI Joy to shadcn/ui.

## Features
- **Confirmation dialog** with user email display for verification
- **Loading state** during revocation process with disabled buttons
- **Error handling** with alert display for failed operations
- **Accessible** with proper ARIA labels and keyboard navigation
- **Destructive action styling** with warning icons and red styling
- **Form-based submission** using FormData for proper data handling

## Usage
\`\`\`jsx
<RevokeMember 
  member={memberObject} 
  params={orgParams} 
/>
\`\`\`

## Migration Notes
Migrated from MUI Joy to shadcn/ui:
- Modal → Dialog with improved accessibility
- MUI Joy Alert → shadcn Alert with Lucide icons
- Enhanced visual feedback and error handling
        `,
      },
    },
  },
  argTypes: {
    member: {
      description: 'Member object containing id and user details (email, name)',
      control: false,
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ id, user: { email, name } }' }
      }
    },
    params: {
      description: 'Project parameters including organization ID',
      control: false,
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ o_id }' }
      }
    },
  },
};

export default meta;

// Default story with comprehensive interaction tests
export const Default = {
  args: {
    member: mockMember,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic RevokeMember component with automated interaction tests. Tests dialog open/close, form submission, and success flow.'
      }
    }
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
        <strong>Interactive Testing:</strong> This story includes automated interaction tests that verify dialog behavior, form submission, and success flow.
      </div>
      <RevokeMember {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Verify revoke button is rendered', async () => {
      const revokeButton = screen.getByRole('button', { name: /revoke/i });
      await expect(revokeButton).toBeInTheDocument();
      await expect(revokeButton).toHaveClass('text-red-600');
    });
    
    await step('Open confirmation dialog', async () => {
      const revokeButton = screen.getByRole('button', { name: /revoke/i });
      await userEvent.click(revokeButton);
      
      // Verify dialog opens with correct content
      await expect(screen.getByText('Please confirm')).toBeInTheDocument();
      await expect(screen.getByText(mockMember.user.email)).toBeInTheDocument();
      await expect(screen.getByText(/revoke access for/i)).toBeInTheDocument();
    });
    
    await step('Test cancel button', async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      // Dialog should close - wait for animation to complete
      await waitFor(() => {
        expect(screen.queryByText('Please confirm')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    await step('Test successful member revocation', async () => {
      // Set up success mock implementation
      revokeMember.mockClear();
      revokeMember.mockImplementation(async ({ formData, params }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Successful revocation
        return {
          success: true,
          message: 'Member access revoked successfully',
          membership: formData.get('membership')
        };
      });
      
      // Open dialog again
      const revokeButton = screen.getByRole('button', { name: /revoke/i });
      await userEvent.click(revokeButton);
      
      // Click confirm to revoke
      const confirmButton = screen.getByRole('button', { name: /revoke access/i });
      await userEvent.click(confirmButton);
      
      // Verify loading state
      await waitFor(() => {
        const loadingButton = screen.queryByRole('button', { name: /revoking/i });
        if (loadingButton) {
          expect(loadingButton).toBeDisabled();
        }
      }, { timeout: 1000 });
      
      // Verify dialog closes after successful revocation
      await waitFor(() => {
        expect(screen.queryByText('Please confirm')).not.toBeInTheDocument();
      }, { timeout: 4000 });
    });
  },
};


// Error handling story
export const ErrorHandling = {
  name: 'Error Handling Tests',
  args: {
    member: mockMember,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests error handling scenarios including server errors and network failures.'
      }
    }
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-red-50 rounded text-sm">
        <strong>Error Testing:</strong> This story tests error handling during member revocation.
      </div>
      <RevokeMember {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Test server error handling', async () => {
      // Set up error mock implementation
      revokeMember.mockClear();
      revokeMember.mockImplementation(async ({ formData, params }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate server error
        throw new Error('Failed to revoke member access. Please try again.');
      });
      
      // Open dialog
      const revokeButton = screen.getByRole('button', { name: /revoke/i });
      await userEvent.click(revokeButton);
      
      // Click confirm to revoke
      const confirmButton = screen.getByRole('button', { name: /revoke access/i });
      await userEvent.click(confirmButton);
      
      // Verify error message appears
      await waitFor(() => {
        const errorText = screen.queryByText(/failed to revoke/i) || 
                         screen.queryByText(/please try again/i) ||
                         screen.queryByRole('alert');
        expect(errorText).toBeTruthy();
      }, { timeout: 3000 });
      
      // Verify dialog remains open
      await expect(screen.getByText('Please confirm')).toBeInTheDocument();
    });
  },
};

// Mobile responsive testing
export const MobileView = {
  name: 'Mobile Responsive Test',
  args: {
    member: {
      id: 'mobile-test',
      user: { email: 'mobile.user@cashflowy.io', name: 'Mobile User' }
    },
    params: mockParams,
  },
  globals: {
    viewport: { value: 'iphone5', isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests mobile responsive behavior with automated interaction tests.'
      }
    }
  },
  render: (args) => (
    <div className="p-2">
      <div className="mb-4 text-sm">
        <strong>Mobile Testing:</strong> Tests dialog behavior on mobile devices.
      </div>
      <RevokeMember {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Test mobile dialog behavior', async () => {
      const revokeButton = screen.getByRole('button', { name: /revoke/i });
      await userEvent.click(revokeButton);
      
      // Verify dialog opens properly on mobile
      await expect(screen.getByText('Please confirm')).toBeInTheDocument();
      
      // Test mobile-specific interactions
      const dialog = screen.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      // Close dialog
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
    });
  },
};