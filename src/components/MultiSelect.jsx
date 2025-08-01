"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function MultiSelect({
  name,
  defaultValue = [],
  options = [],
  placeholder = "Select items...",
  className,
  size = "default",
  maxDisplayItems = 3,
  ...props
}) {
  // Parse defaultValue - could be string or array
  const initialSelected = React.useMemo(() => {
    if (typeof defaultValue === 'string') {
      return defaultValue ? defaultValue.split(',') : [];
    }
    return Array.isArray(defaultValue) ? defaultValue : [];
  }, [defaultValue]);

  const [selectedValues, setSelectedValues] = React.useState(initialSelected);
  const [isOpen, setIsOpen] = React.useState(false);

  // Reset internal state when defaultValue changes (for reset functionality)
  React.useEffect(() => {
    const newSelected = typeof defaultValue === 'string' 
      ? (defaultValue ? defaultValue.split(',') : [])
      : (Array.isArray(defaultValue) ? defaultValue : []);
    setSelectedValues(newSelected);
  }, [defaultValue]);

  const toggleOption = (value) => {
    setSelectedValues(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };


  const getSelectedOptions = () => {
    return options.filter(option => selectedValues.includes(option.value?.toString()));
  };

  const getDisplayText = () => {
    const selected = getSelectedOptions();
    if (selected.length === 0) return placeholder;
    if (selected.length <= maxDisplayItems) {
      return selected.map(opt => opt.label).join(', ');
    }
    return `${selected.length} items selected`;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden checkboxes for form compatibility */}
      {selectedValues.map(value => (
        <input
          key={value}
          type="checkbox"
          name={name}
          value={value}
          checked
          readOnly
          style={{ display: 'none' }}
        />
      ))}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={cn(
              "w-full justify-between text-left font-normal",
              !selectedValues.length && "text-muted-foreground"
            )}
            {...props}
          >
            <div className="flex flex-1 flex-wrap gap-1 overflow-hidden">
              {selectedValues.length === 0 ? (
                <span>{placeholder}</span>
              ) : selectedValues.length <= 2 ? (
                getSelectedOptions().map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                  </Badge>
                ))
              ) : (
                <span>{selectedValues.length} items selected</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]" align="start">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value?.toString());
            return (
              <DropdownMenuItem
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  toggleOption(option.value?.toString());
                }}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-white"
                      : "opacity-50 [&_svg]:invisible"
                  )}>
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span>{option.label}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { MultiSelect }