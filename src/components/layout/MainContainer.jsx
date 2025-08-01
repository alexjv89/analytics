import React from 'react';
import { cn } from '@/lib/utils';

export default function MainContainer({ children, className }) {
  return (
    <div className={cn("@container/main m-4 mt-3 flex flex-col", className)}>
      {children}
    </div>
  );
}