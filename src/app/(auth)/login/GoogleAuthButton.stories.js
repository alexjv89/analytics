// 1. Component import (always first)
import GoogleAuthButton from './GoogleAuthButton';

// 2. Mock imports using subpath imports

// 3. Test utilities for interaction tests
import { screen, userEvent, expect, waitFor } from 'storybook/test';

export default {
  title: 'Pages/(auth)/login/GoogleAuthButton',
  component: GoogleAuthButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Google authentication button component with loading states and error handling. Integrates with NextAuth.js Google provider and shows proper loading feedback during authentication flow.',
      },
    },
  },
  argTypes: {
    // No props - component manages internal state
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Default Google authentication button ready for user interaction.',
      },
    },
  },
};

export const Interactive = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive button that demonstrates the complete authentication flow including loading state. Click to see the loading behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // This demonstrates how to test the component interaction
    const canvas = { ...screen, getByRole: (role, options) => canvasElement.querySelector(`[role="${role}"]`) || screen.getByRole(role, options) };
    
    // Wait for button to be ready
    await waitFor(() => {
      expect(canvas.getByRole('button')).toBeInTheDocument();
    });
  },
};

export const LoadingState = {
  render: () => {
    // Create a component with forced loading state for documentation
    const LoadingDemo = () => {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Simulated loading state:</p>
            <button 
              disabled 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-2 h-4 w-4"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              Logging in...
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Interactive button (click to test):</p>
            <GoogleAuthButton />
          </div>
        </div>
      );
    };
    
    return <LoadingDemo />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison showing the loading state styling and an interactive button to test the flow.',
      },
    },
  },
};


