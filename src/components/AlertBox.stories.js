import AlertBox from './AlertBox';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { expect } from 'storybook/test';

export default {
  title: 'components/AlertBox',
  component: AlertBox,
  argTypes: {
    color: {
      control: 'select',
      options: ['warning', 'danger', 'success', 'info'],
    },
    icon: {
      control: 'boolean',
    },
  },
};

// Basic warning alert
export const Warning = {
  args: {
    title: 'Warning',
    message: 'This is a warning message',
    color: 'warning',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Warning')).toBeInTheDocument();
    await expect(canvas.getByText('This is a warning message')).toBeInTheDocument();
    // Optionally, check for the icon by role or test id if your AlertBox supports it
  },
};

// Danger alert with list items
export const DangerWithList = {
  args: {
    title: 'Error',
    message: [
      'Invalid email format',
      'Password must be at least 8 characters',
      'Username is required',
    ],
    color: 'danger',
    icon: <XCircle />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Error')).toBeInTheDocument();
    await expect(canvas.getByText('Invalid email format')).toBeInTheDocument();
    await expect(canvas.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    await expect(canvas.getByText('Username is required')).toBeInTheDocument();
  },
};

// Success alert
export const Success = {
  args: {
    title: 'Success',
    message: 'Your changes have been saved successfully!',
    color: 'success',
    icon: <CheckCircle />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Success')).toBeInTheDocument();
    await expect(canvas.getByText('Your changes have been saved successfully!')).toBeInTheDocument();
  },
};

// Info alert
export const InfoIcon = {
  args: {
    title: 'Information',
    message: 'This is an informational message for the user.',
    color: 'info',
    icon: <Info />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Information')).toBeInTheDocument();
    await expect(canvas.getByText('This is an informational message for the user.')).toBeInTheDocument();
  },
};

// Alert without title - shows proper icon alignment
export const WithoutTitle = {
  args: {
    message: 'This is an app-native part created directly in the system. It is not synced with Salesforce and does not have Salesforce data.',
    color: 'info',
    icon: <Info />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('This is an app-native part created directly in the system. It is not synced with Salesforce and does not have Salesforce data.')).toBeInTheDocument();
    // Verify no title is rendered when title prop is not provided
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
  },
};
