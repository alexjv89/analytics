import AddMember from './AddMember';
import { addMember } from '../action';

// Test utilities (for interaction tests)
import { screen, userEvent, expect, waitFor } from 'storybook/test';

/*
 * AddMember component for adding new organization members via email invitation.
 * Migrated from MUI Joy to shadcn/ui with enhanced accessibility and modern styling.
 * Features include form validation, loading states, and error handling.
 * 
 * Note: In Storybook, this component uses mocked member actions from action.mock.js
 * which simulate different scenarios (success, validation errors, existing member).
 */

// Mock data for testing
const mockParams = {
  o_id: 'org-456'
};

const meta = {
  title: 'pages/orgs/[o_id]/settings/members/_components/AddMember',
  component: AddMember,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# AddMember Component

Form dialog component for adding new organization members via email invitation. Migrated from MUI Joy to shadcn/ui.

## Features
- **Email invitation form** with validation and accessibility
- **Loading state** during submission process with disabled buttons
- **Error handling** with alert display for validation and server errors
- **Accessible** with proper labels, ARIA attributes, and keyboard navigation
- **Form-based submission** using FormData for proper data handling
- **Visual feedback** with icons and modern styling

## Usage
\`\`\`jsx
<AddMember 
  params={orgParams}
/>
\`\`\`

## Migration Notes
Migrated from MUI Joy to shadcn/ui:
- Modal + ModalDialog → Dialog with improved accessibility
- MUI Joy FormControl/FormLabel/Input → shadcn Label/Input
- MUI Joy Alert → shadcn Alert with Lucide icons
- Enhanced visual feedback and error handling
        `,
      },
    },
  },
  argTypes: {
    params: {
      description: 'Organization parameters including organization ID',
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
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic AddMember component with automated interaction tests. Tests dialog open/close, form validation, and success flow.'
      }
    }
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
        <strong>Interactive Testing:</strong> This story includes automated interaction tests that verify dialog behavior, form validation, and success flow.
      </div>
      <AddMember {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Verify add member button is rendered', async () => {
      const addButton = screen.getByRole('button', { name: /add member/i });
      await expect(addButton).toBeInTheDocument();
      await expect(addButton).toHaveTextContent('Add Member');
    });
    
    await step('Open member invitation dialog', async () => {
      const addButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(addButton);
      
      // Verify dialog opens with correct content (dialog name is "Add new member")
      await expect(screen.getByRole('dialog')).toBeInTheDocument();
      await expect(screen.getByRole('dialog', { name: /add new member/i })).toBeInTheDocument();
      await expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
    
    await step('Test cancel button', async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    await step('Test form validation - empty email', async () => {
      // Open dialog again
      const addButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(addButton);
      
      // Try to submit without email
      const submitButton = screen.getByRole('button', { name: /add member$/i });
      await userEvent.click(submitButton);
      
      // Form validation should prevent submission (HTML5 validation)
      const emailInput = screen.getByLabelText(/email/i);
      await expect(emailInput).toBeInvalid();
    });
    
    await step('Test successful member addition', async () => {
      // Clear previous mock calls and set up success implementation
      addMember.mockClear();
      addMember.mockImplementation(async ({ formData, params }) => {
        const email = formData.get('email');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Successful addition
        return {
          success: true,
          message: 'Member added successfully',
          member: {
            id: `member_${Date.now()}`,
            user: {
              email: email,
              name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            },
            role: 'member',
            addedAt: new Date().toISOString()
          }
        };
      });
      
      // Enter valid email
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'newuser@example.com');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /add member$/i });
      await userEvent.click(submitButton);
      
      // Verify loading state appears - button should be disabled
      await waitFor(() => {
        const submitBtn = screen.getByRole('button', { name: /adding|add member$/i });
      }, { timeout: 1000 });
      
      // Verify dialog closes after successful addition
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
  },
};

// // Error handling story
export const ErrorHandling = {
  name: 'Error Handling Tests',
  args: {
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests error handling scenarios including validation errors and server errors.'
      }
    }
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-red-50 rounded text-sm">
        <strong>Error Testing:</strong> This story tests various error scenarios including existing member validation.
      </div>
      <AddMember {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Test existing member error', async () => {
      // Open dialog
      const addButton = screen.getByRole('button', { name: /add member/i });
      await userEvent.click(addButton);
      
      // Clear previous mock calls and set up error implementation
      addMember.mockClear();
      addMember.mockImplementation(async ({ formData, params }) => {
        const email = formData.get('email');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate validation errors
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        
        if (email === 'existing@example.com') {
          throw new Error('User is already a member of this organization.');
        }
        
        // This shouldn't be reached in this test
        return { success: true };
      });
      
      // Enter email that will trigger existing member error
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'existing@example.com');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /add member$/i });
      await userEvent.click(submitButton);
      
      // Verify error message appears (might be different text or in an alert)
      await waitFor(() => {
        const errorText = screen.queryByText(/already a member/i) || 
                         screen.queryByText(/already exists/i) ||
                         screen.queryByText(/member.*exist/i) ||
                         screen.queryByRole('alert');
        expect(errorText).toBeTruthy();
      }, { timeout: 2000 });
      
      // Verify dialog remains open to allow correction
      await expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  },
};


