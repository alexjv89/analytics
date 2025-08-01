"use client";

import { ProgressProvider as BProgressProvider } from '@bprogress/next/app';

export function ProgressProvider({ children }) {
  return (
    <BProgressProvider 
      height="4px" 
      color="#0d99fd" 
      options={{ showSpinner: false }}
    >
      {children}
    </BProgressProvider>
  );
}

export default ProgressProvider;