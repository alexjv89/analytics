'use client'
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AlertBox = ({
    title,
    message,
    icon,
    color = 'warning'
}) => {
  // Map color props to alert variants
  const getVariant = (color) => {
    switch (color) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'default';
    }
  };
  
  return (
    <Alert variant={getVariant(color)}>
      {icon && React.cloneElement(icon, { className: "h-4 w-4" })}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        {Array.isArray(message) ? (
          <ul className="list-disc list-inside space-y-1">
            {message.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : message}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBox;
