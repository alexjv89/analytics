import React from 'react';
import { cn } from '@/lib/utils';

const ButtonGroup = ({ children, className, spacing = 1, ...props }) => {
  const gapClass = spacing === 1 ? 'gap-1' : spacing === 2 ? 'gap-2' : spacing === 3 ? 'gap-3' : `gap-${spacing}`;
  
  return (
    <div 
      className={cn("flex", gapClass, className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export { ButtonGroup };