'use client';
import { useState } from 'react';
import OutlineToggleGroup from '@/components/OutlineToggleGroup';

export default function TableOrCards() {
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('table_or_card') || 'cards';
    }
    return 'cards';
  };

  const [viewAs, setViewAs] = useState(getInitialView);

  const handleChange = (newValue) => {
    setViewAs(newValue);
    localStorage.setItem('table_or_card', newValue);
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const options = [
    { value: 'table', label: 'Table' },
    { value: 'cards', label: 'Cards' }
  ];

  return (
    <OutlineToggleGroup 
      value={viewAs}
      onValueChange={handleChange}
      options={options}
    />
  );
}