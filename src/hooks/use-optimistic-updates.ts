
import { useState, useCallback } from 'react';

/**
 * Custom hook to handle optimistic updates for improved user experience
 * 
 * This hook provides a way to update UI immediately before waiting for API responses.
 * It manages loading states, errors, and rollbacks if the remote operation fails.
 */
export function useOptimisticUpdate<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Perform an optimistic update
   * @param currentData Current data state
   * @param optimisticUpdate Function to update data optimistically
   * @param remoteOperation Remote operation to perform (API call)
   * @param rollbackOnError Whether to roll back to original data on error (default: true)
   */
  const performOptimisticUpdate = useCallback(async (
    currentData: T,
    optimisticUpdate: (current: T) => T,
    remoteOperation: () => Promise<T>,
    rollbackOnError: boolean = true
  ) => {
    // Store original data for potential rollback
    const originalData = currentData;
    
    // Apply optimistic update immediately
    const optimisticData = optimisticUpdate(currentData);
    setData(optimisticData);
    
    // Start loading state
    setIsLoading(true);
    setError(null);
    
    try {
      // Perform the actual remote operation
      const result = await remoteOperation();
      
      // Update with actual result from server
      setData(result);
      setIsLoading(false);
      
      return result;
    } catch (err) {
      // Handle error - roll back if specified
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      if (rollbackOnError) {
        setData(originalData);
      }
      
      setIsLoading(false);
      throw err;
    }
  }, []);

  /**
   * Add an item optimistically
   * @param currentItems Current array of items
   * @param newItem Item to add
   * @param addOperation Remote operation to add the item
   */
  const addOptimistically = useCallback(<U>(
    currentItems: U[],
    newItem: U,
    addOperation: () => Promise<U[]>
  ) => {
    return performOptimisticUpdate(
      currentItems as unknown as T,
      (current) => [...(current as unknown as U[]), newItem] as unknown as T,
      addOperation as unknown as () => Promise<T>,
      true
    );
  }, [performOptimisticUpdate]);

  /**
   * Update an item optimistically
   * @param currentItems Current array of items
   * @param updatedItem Item with updates
   * @param itemId Function to determine the item to update
   * @param updateOperation Remote operation to update the item
   */
  const updateOptimistically = useCallback(<U>(
    currentItems: U[],
    updatedItem: U,
    itemId: (item: U) => boolean,
    updateOperation: () => Promise<U[]>
  ) => {
    return performOptimisticUpdate(
      currentItems as unknown as T,
      (current) => {
        const items = current as unknown as U[];
        return items.map(item => itemId(item) ? updatedItem : item) as unknown as T;
      },
      updateOperation as unknown as () => Promise<T>,
      true
    );
  }, [performOptimisticUpdate]);

  /**
   * Remove an item optimistically
   * @param currentItems Current array of items
   * @param itemId Function to determine the item to remove
   * @param removeOperation Remote operation to remove the item
   */
  const removeOptimistically = useCallback(<U>(
    currentItems: U[],
    itemId: (item: U) => boolean,
    removeOperation: () => Promise<U[]>
  ) => {
    return performOptimisticUpdate(
      currentItems as unknown as T,
      (current) => {
        const items = current as unknown as U[];
        return items.filter(item => !itemId(item)) as unknown as T;
      },
      removeOperation as unknown as () => Promise<T>,
      true
    );
  }, [performOptimisticUpdate]);

  return {
    data,
    isLoading,
    error,
    performOptimisticUpdate,
    addOptimistically,
    updateOptimistically,
    removeOptimistically,
    setData
  };
}
