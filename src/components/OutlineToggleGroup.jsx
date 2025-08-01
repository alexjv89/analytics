'use client';
import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

/**
 * Generic OutlineToggleGroup component for consistent toggle group behavior
 * @param {Object} props
 * @param {string} props.value - Current selected value
 * @param {Function} props.onValueChange - Callback when value changes
 * @param {Array} props.options - Array of {value: string, label: string | ReactNode}
 * @param {'default' | 'compact'} props.size - Size variant
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - ToggleGroup variant (defaults to 'outline')
 */
export default function OutlineToggleGroup({ 
  value, 
  onValueChange, 
  options = [], 
  size = 'default',
  className,
  variant = 'outline'
}) {
  const handleValueChange = (newValue) => {
    if (newValue) {
      onValueChange(newValue);
    }
  };

  const sizeClasses = {
    default: '',
    compact: 'h-8'
  };

  const itemSizeClasses = {
    default: 'text-xs',
    compact: 'px-3 py-1 text-xs'
  };

  return (
    <ToggleGroup
      type="single"
      variant={variant}
      value={value}
      onValueChange={handleValueChange}
      className={cn(sizeClasses[size], className)}
    >
      {options.map((option) => (
        <ToggleGroupItem 
          key={option.value} 
          value={option.value}
          size={size === 'compact' ? 'sm' : undefined}
          className={cn(itemSizeClasses[size])}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}