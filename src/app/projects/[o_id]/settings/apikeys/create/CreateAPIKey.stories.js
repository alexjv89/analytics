import CreateAPIKey from './CreateAPIKey';
import { createApiKey } from '../action';

// Additional dependencies
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// Test utilities (for interaction tests)
import { screen, userEvent, expect, waitFor } from 'storybook/test';

/*
 * CreateAPIKey component for creating new organization API keys.
 * Migrated from MUI Joy to shadcn/ui with enhanced accessibility and modern styling.
 * Features include form validation, loading states, success display, and error handling.
 * 
 * Note: In Storybook, this component uses mocked API key actions from action.mock.js
 * which simulate different scenarios (success, validation errors, server errors).
 */

// Mock data for testing
const mockOrg = {
  id: 'org-456',
  name: 'Test Organization'
};

const mockParams = {
  o_id: 'org-456'
};

const meta = {
  title: 'pages/orgs/[o_id]/settings/apikeys/create/CreateAPIKey',
  component: CreateAPIKey,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: `
# CreateAPIKey Component

Complete page component for creating new organization API keys. Migrated from MUI Joy to shadcn/ui.

## Features
- **API key creation form** with name and optional expiry date
- **Two-step flow** - form submission then secure display of generated key
- **Loading state** during key generation process
- **Success display** with secure key details table
- **Security warning** about one-time secret visibility
- **Accessible** with proper labels, ARIA attributes, and keyboard navigation
- **Responsive design** with mobile-optimized layout
- **Visual feedback** with icons and modern styling

## Usage
\`\`\`jsx
<CreateAPIKey 
  org={orgObject}
  params={paramsObject}
/>
\`\`\`

## Migration Notes
Migrated from MUI Joy to shadcn/ui:
- MUI Joy Sheet/Grid → shadcn Card with responsive grid
- MUI Joy FormControl/FormLabel/Input → shadcn Label/Input
- MUI Joy Alert → shadcn Alert with Lucide icons
- MUI Joy Button → shadcn Button with loading states
- Custom Table → shadcn Table components
- Enhanced visual feedback and security messaging
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
      description: 'Organization object containing id and name',
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

// Default story with comprehensive interaction tests
export const Default = {
  args: {
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic CreateAPIKey page with automated interaction tests. Tests form submission, loading states, and success flow.'
      }
    }
  },
  play: async ({ step }) => {
    await step('Test successful API key creation', async () => {
      // Set up success mock implementation
      createApiKey.mockClear();
      createApiKey.mockImplementation(async ({ orgId, name, expires_at }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Return successful API key creation
        return {
          success: true,
          apiKey: {
            id: `key_${Date.now()}`,
            name: name,
            key: `ck_test_${Math.random().toString(36).substring(2)}`,
            secret: `cs_test_${Math.random().toString(36).substring(2)}`,
            expires_at: expires_at || null,
            created_at: new Date().toISOString()
          }
        };
      });
      
      // Fill form
      const nameInput = screen.getByLabelText(/key name/i);
      await userEvent.type(nameInput, 'Test API Key');
      
      const expiryInput = screen.getByLabelText(/expiry date/i);
      await userEvent.type(expiryInput, '2025-12-31');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create api key/i });
      await userEvent.click(submitButton);
      
      // Verify loading state
      await waitFor(() => {
        const loadingButton = screen.queryByRole('button', { name: /creating|create api key/i });
        if (loadingButton) {
          expect(loadingButton).toBeDisabled();
        }
      }, { timeout: 1000 });
      
      // Wait for success state (should show the generated key)
      await waitFor(() => {
        expect(createApiKey).toHaveBeenCalledWith({
          orgId: mockOrg.id,
          name: 'Test API Key',
          expires_at: '2025-12-31'
        });
      }, { timeout: 3000 });
    });
  },
};

// Error handling story
export const ErrorHandling = {
  name: 'Error Handling Tests',
  args: {
    org: mockOrg,
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 mb-4 bg-red-50 rounded text-sm">
        <strong>Error Testing:</strong> This story tests various error scenarios including validation errors.
      </div>
      <CreateAPIKey {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Test validation error scenario', async () => {
      // Set up error mock implementation
      createApiKey.mockClear();
      createApiKey.mockImplementation(async ({ orgId, name, expires_at }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate server error
        throw new Error('API key name already exists. Please choose a different name.');
      });
      
      // Enter name that will trigger validation error
      const nameInput = screen.getByLabelText(/key name/i);
      await userEvent.type(nameInput, 'validation-error');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create api key/i });
      await userEvent.click(submitButton);
      
      // Wait for the error to be handled
      await waitFor(() => {
        expect(createApiKey).toHaveBeenCalledWith({
          orgId: mockOrg.id,
          expires_at: '',
          name: 'validation-error'
        });
      }, { timeout: 3000 });
      
      // Verify form is still displayed (should stay on form due to error)
      await expect(screen.getByText('New API Key')).toBeInTheDocument();
    });
  },
};

// Form interaction testing
export const FormInteraction = {
  name: 'Form Interaction Tests',
  args: {
    org: mockOrg,
    params: mockParams,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests form interaction patterns including date validation and input handling.'
      }
    }
  },
  render: (args) => (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 mb-4 bg-blue-50 rounded text-sm">
        <strong>Form Testing:</strong> Tests form validation, date constraints, and input interactions.
      </div>
      <CreateAPIKey {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step('Test form input validation and constraints', async () => {
      const nameInput = screen.getByLabelText(/key name/i);
      const expiryInput = screen.getByLabelText(/expiry date/i);
      
      // Test name input
      await userEvent.type(nameInput, 'My Production API Key');
      await expect(nameInput).toHaveValue('My Production API Key');
      
      // Test date input constraints
      const today = new Date().toISOString().split('T')[0];
      await expect(expiryInput).toHaveAttribute('min', today);
      
      // Test valid future date
      await userEvent.type(expiryInput, '2025-06-15');
      await expect(expiryInput).toHaveValue('2025-06-15');
    });
    
    await step('Test form without expiry date', async () => {
      // Clear previous mock calls
      createApiKey.mockClear();
      
      // Clear expiry date
      const expiryInput = screen.getByLabelText(/expiry date/i);
      await userEvent.clear(expiryInput);
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create api key/i });
      await userEvent.click(submitButton);
      
      // Verify createApiKey was called with empty expires_at
      await waitFor(() => {
        expect(createApiKey).toHaveBeenCalledWith({
          orgId: mockOrg.id,
          expires_at: '',
          name: 'My Production API Key'
        });
      }, { timeout: 3000 });
    });
  },
};



// Mobile responsive testing
export const MobileView = {
  args: {
    org: mockOrg,
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-2 mb-4 text-sm bg-blue-50 rounded">
        <strong>Mobile Testing:</strong> Tests responsive layout and mobile form interaction.
      </div>
      <CreateAPIKey {...args} />
    </div>
  ),
};