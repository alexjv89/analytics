// 1. Component import (always first)
import Login from './Login';

// 2. Mock imports using subpath imports
import { loginWithGoogle } from '@/auth/action';

// 3. Test utilities for interaction tests
import { screen, userEvent, expect, waitFor } from 'storybook/test';

export default {
  title: 'Pages/auth/login/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete login page component featuring the Cashflowy logo, welcome messaging, and Google authentication. Built with shadcn/ui components and designed for responsive layouts.',
      },
    },
  },
  argTypes: {
    searchParams: {
      control: { type: 'object' },
      description: 'URL search parameters, particularly for error messages',
    },
  },
};

export const Default = {
  args: {
    searchParams: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default login page with logo, welcome message, and Google authentication button.',
      },
    },
  },
};




export const InteractiveFlow = {
  args: {
    searchParams: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = { ...screen, getByRole: (role, options) => canvasElement.querySelector(`[role="${role}"]`) || screen.getByRole(role, options) };
    
    // Wait for the page to load
    await waitFor(() => {
      expect(canvas.getByText('Welcome to Cashflowy')).toBeInTheDocument();
    });
    
    // Verify logo is present
    expect(canvas.getByAltText('Cashflowy')).toBeInTheDocument();
    
    // Verify welcome message
    expect(canvas.getByText('Sign in to continue to your account')).toBeInTheDocument();
    
    // Find and verify Google login button
    const googleButton = canvas.getByRole('button', { name: /login with google/i });
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).not.toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive test demonstrating the login page elements and functionality.',
      },
    },
  },
};

export const WithErrorAndInteraction = {
  args: {
    searchParams: {
      message: 'Google authentication temporarily unavailable. Please try again.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = { ...screen, getByRole: (role, options) => canvasElement.querySelector(`[role="${role}"]`) || screen.getByRole(role, options) };
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(canvas.getByText('Google authentication temporarily unavailable. Please try again.')).toBeInTheDocument();
    });
    
    // Verify error message styling (destructive alert)
    const errorAlert = canvas.getByText('Google authentication temporarily unavailable. Please try again.').closest('[role="alert"]');
    expect(errorAlert).toBeInTheDocument();
    
    // Verify the button is still functional despite error
    const googleButton = canvas.getByRole('button', { name: /login with google/i });
    expect(googleButton).not.toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story: 'Login page with error message and interaction testing to verify proper error handling.',
      },
    },
  },
};
