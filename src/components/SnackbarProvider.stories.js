import { useSnackbar, SnackbarProvider } from './SnackbarProvider';
import { Button } from '@/components/ui/button';

/*
 * SnackbarProvider uses Sonner for modern toast notifications.
 * It maintains the same API as the previous MUI Joy implementation but with enhanced features:
 * - Rich colors and icons
 * - Better accessibility 
 * - Smooth animations
 * - Auto-stacking multiple toasts
 */

function ToastButton({ contents, color, variant = "default" }) {
  const { showSnackbar } = useSnackbar();

  const handleClick = () => {
    showSnackbar({
      content: contents || 'This is a toast message',
      color: color || 'success',
    });
  };

  return (
    <Button variant={variant} onClick={handleClick}>
      Show {color} Toast
    </Button>
  );
}

function MultipleToastsDemo() {
  const { showSnackbar, hideSnackbar } = useSnackbar();

  const showMultiple = () => {
    showSnackbar({ content: 'First toast message', color: 'info' });
    setTimeout(() => showSnackbar({ content: 'Second toast message', color: 'success' }), 500);
    setTimeout(() => showSnackbar({ content: 'Third toast message', color: 'warning' }), 1000);
  };

  const clearAll = () => {
    hideSnackbar();
  };

  return (
    <div className="space-x-2">
      <Button onClick={showMultiple}>Show Multiple Toasts</Button>
      <Button variant="outline" onClick={clearAll}>Clear All</Button>
    </div>
  );
}

function RichContentDemo() {
  const { showSnackbar } = useSnackbar();

  const showRichContent = () => {
    showSnackbar({
      content: '<strong>Quote saved successfully!</strong><br/>View it in the <em>pricing tab</em>.',
      color: 'success'
    });
  };

  return (
    <Button onClick={showRichContent}>Show Rich Content Toast</Button>
  );
}

export default {
  title: 'components/SnackbarProvider',
  component: ToastButton,
  parameters: {
    docs: {
      description: {
        component: `
# SnackbarProvider (Sonner Toast System)

Modern toast notification system using Sonner with Shadcn integration. Maintains full backward compatibility with the previous MUI Joy API while providing enhanced features.

## Features
- **Rich colors** with contextual icons (✅❌⚠️ℹ️)
- **Auto-stacking** multiple toasts
- **Smooth animations** and transitions
- **HTML content support** for rich formatting
- **Accessibility** with screen reader support
- **Mobile gestures** (swipe to dismiss)

## API
- \`showSnackbar({content, color})\` - Show a toast
- \`hideSnackbar()\` - Dismiss all toasts
- \`useSnackbar()\` - Access toast functions

## Color Options
- \`success\` - Green with checkmark icon
- \`error\` / \`danger\` - Red with X icon  
- \`warning\` - Yellow with warning icon
- \`info\` - Blue with info icon
        `,
      },
    },
  },
  argTypes: {
    contents: {
      control: 'text',
      description: 'Content of the toast message (supports HTML)',
      defaultValue: 'This is a toast message',
    },
    color: {
      control: 'select',
      options: ['success', 'info', 'warning', 'danger', 'error'],
      description: 'Toast color/type with automatic icon',
      defaultValue: 'success',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button variant for the demo',
      defaultValue: 'default',
    },
  },
};

// Interactive playground story
export const Playground = {
  args: {
    contents: 'Customize this toast message',
    color: 'info',
    variant: 'default',
  },
  render: (args) => (
    <SnackbarProvider>
      <ToastButton {...args} />
    </SnackbarProvider>
  ),
};

// All toast types in one view
export const AllToastTypes = {
  name: 'All Toast Types',
  render: () => (
    <SnackbarProvider>
      <div className="flex flex-wrap gap-2">
        <ToastButton contents="Operation completed successfully!" color="success" variant="default" />
        <ToastButton contents="Something went wrong. Please try again." color="danger" variant="destructive" />
        <ToastButton contents="Please review your input before continuing." color="warning" variant="outline" />
        <ToastButton contents="Here's some helpful information for you." color="info" variant="secondary" />
        <ToastButton contents="Processing your request..." color="error" variant="ghost" />
      </div>
    </SnackbarProvider>
  ),
};

// Manufacturing domain examples
export const ManufacturingExamples = {
  name: 'Manufacturing Use Cases',
  render: () => (
    <SnackbarProvider>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <ToastButton 
            contents="Quote #Q-2024-0142 saved successfully!" 
            color="success" 
            variant="default" 
          />
          <ToastButton 
            contents="Failed to calculate material costs. Check master data." 
            color="danger" 
            variant="destructive" 
          />
          <ToastButton 
            contents="X-factor of 2.5 seems high for this process type." 
            color="warning" 
            variant="outline" 
          />
          <ToastButton 
            contents="Part synchronized from Salesforce." 
            color="info" 
            variant="secondary" 
          />
        </div>
      </div>
    </SnackbarProvider>
  ),
};

// Multiple toasts demonstration
export const MultipleToasts = {
  name: 'Multiple Toasts & Clearing',
  render: () => (
    <SnackbarProvider>
      <MultipleToastsDemo />
    </SnackbarProvider>
  ),
};

// Rich content with HTML
export const RichContent = {
  name: 'Rich HTML Content',
  render: () => (
    <SnackbarProvider>
      <div className="space-y-2">
        <RichContentDemo />
        <ToastButton 
          contents="<strong>Critical:</strong> Master data version <code>v2.1.0</code> contains <em>breaking changes</em>." 
          color="warning" 
          variant="outline" 
        />
      </div>
    </SnackbarProvider>
  ),
};

// Error handling patterns
export const ErrorPatterns = {
  name: 'Error Handling Patterns',
  render: () => (
    <SnackbarProvider>
      <div className="flex flex-wrap gap-2">
        <ToastButton 
          contents="Network error: Unable to save quote. Check connection." 
          color="danger" 
          variant="destructive" 
        />
        <ToastButton 
          contents="Validation failed: Material cost cannot be negative." 
          color="error" 
          variant="destructive" 
        />
        <ToastButton 
          contents="Session expired. Please log in again." 
          color="warning" 
          variant="outline" 
        />
      </div>
    </SnackbarProvider>
  ),
};