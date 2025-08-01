'use client'
import { createContext, useContext } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const showSnackbar = ({content, color = 'success'}) => {
    // Map MUI Joy colors to Sonner toast types
    switch (color) {
      case 'success':
        toast.success(content, { richColors: true });
        break;
      case 'danger':
      case 'error':
        toast.error(content, { richColors: true });
        break;
      case 'warning':
        toast.warning(content, { richColors: true });
        break;
      case 'info':
        toast.info(content, { richColors: true });
        break;
      default:
        toast(content);
    }
  };

  const hideSnackbar = () => {
    toast.dismiss();
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Toaster 
        position="top-right"
        duration={5000}
        richColors
      />
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}; 