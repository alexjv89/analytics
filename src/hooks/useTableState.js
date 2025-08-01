import { useState, useEffect } from 'react';

export function useTableState(tableId, initialState = {}) {
  const storageKey = `table-state-${tableId}`;

  // Helper to validate state structure
  const validateState = (state) => {
    const validated = { ...initialState };
    
    if (state.sorting !== undefined) {
      validated.sorting = Array.isArray(state.sorting) ? state.sorting : initialState.sorting || [];
    }
    
    if (state.columnVisibility !== undefined) {
      validated.columnVisibility = (state.columnVisibility && typeof state.columnVisibility === 'object' && !Array.isArray(state.columnVisibility))
        ? state.columnVisibility 
        : initialState.columnVisibility || {};
    }
    
    if (state.columnOrder !== undefined) {
      validated.columnOrder = Array.isArray(state.columnOrder) ? state.columnOrder : initialState.columnOrder || [];
    }
    
    if (state.columnSizing !== undefined) {
      validated.columnSizing = (state.columnSizing && typeof state.columnSizing === 'object' && !Array.isArray(state.columnSizing))
        ? state.columnSizing
        : initialState.columnSizing || {};
    }
    
    return validated;
  };

  // Initialize state from localStorage or use initial state
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialState;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return validateState({ ...initialState, ...parsed });
      }
    } catch (e) {
      console.error('Error loading table state from localStorage:', e);
      // Clear corrupted data
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
    
    return initialState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving table state to localStorage:', e);
    }
  }, [state, storageKey]);

  // Provide individual setters that update the state object
  const setSorting = (sorting) => {
    // Ensure sorting is always an array
    const newSorting = typeof sorting === 'function' 
      ? sorting(state.sorting || [])
      : sorting;
    setState(prev => ({ ...prev, sorting: newSorting }));
  };

  const setColumnVisibility = (columnVisibility) => {
    // Ensure columnVisibility is always an object
    const newVisibility = typeof columnVisibility === 'function'
      ? columnVisibility(state.columnVisibility || {})
      : columnVisibility;
    setState(prev => ({ ...prev, columnVisibility: newVisibility }));
  };

  const setColumnOrder = (columnOrder) => {
    // Ensure columnOrder is always an array
    const newOrder = typeof columnOrder === 'function'
      ? columnOrder(state.columnOrder || [])
      : columnOrder;
    setState(prev => ({ ...prev, columnOrder: newOrder }));
  };

  const setColumnSizing = (columnSizing) => {
    // Ensure columnSizing is always an object
    const newSizing = typeof columnSizing === 'function'
      ? columnSizing(state.columnSizing || {})
      : columnSizing;
    setState(prev => ({ ...prev, columnSizing: newSizing }));
  };

  // Ensure we always return valid data structures
  return {
    sorting: Array.isArray(state.sorting) ? state.sorting : [],
    setSorting,
    columnVisibility: (state.columnVisibility && typeof state.columnVisibility === 'object') 
      ? state.columnVisibility 
      : {},
    setColumnVisibility,
    columnOrder: Array.isArray(state.columnOrder) ? state.columnOrder : [],
    setColumnOrder,
    columnSizing: (state.columnSizing && typeof state.columnSizing === 'object') 
      ? state.columnSizing 
      : {},
    setColumnSizing,
  };
}