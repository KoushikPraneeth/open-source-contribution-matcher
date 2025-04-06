
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type OptimisticUpdateOptions<T> = {
  // The value to show immediately in the UI
  optimisticValue: T;
  // Whether to revert to previous value on error (defaults to true)
  rollbackOnError?: boolean;
  // Success message to show (optional)
  successMessage?: string;
  // Error message to show (optional)
  errorMessage?: string;
};

/**
 * Hook for handling optimistic UI updates with toast notifications
 * @param initialState The initial state value
 */
export function useOptimisticUpdates<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [previousState, setPreviousState] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  /**
   * Updates the state optimistically before the async action completes
   * @param asyncAction The async action to perform
   * @param options Options for the optimistic update
   */
  const optimisticUpdate = useCallback(
    async (
      asyncAction: () => Promise<T>,
      { 
        optimisticValue, 
        rollbackOnError = true,
        successMessage,
        errorMessage
      }: OptimisticUpdateOptions<T>
    ) => {
      // Save the previous state for potential rollback
      setPreviousState(state);
      
      // Update the state optimistically
      setState(optimisticValue);
      setIsLoading(true);
      setError(null);

      try {
        // Perform the actual async action
        const result = await asyncAction();
        
        // Update with the real result
        setState(result);
        
        // Show success toast if message provided
        if (successMessage) {
          toast({
            title: "Success",
            description: successMessage,
            variant: "default"
          });
        }
        
        return result;
      } catch (err) {
        // Handle errors
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Show error toast
        toast({
          title: "Error",
          description: errorMessage || error.message,
          variant: "destructive"
        });
        
        // Rollback if specified
        if (rollbackOnError && previousState !== null) {
          setState(previousState);
        }
        
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [state, previousState, toast]
  );
  
  /**
   * Updates multiple items in a collection optimistically
   * @param collection The collection to update
   * @param itemId The ID of the item to update
   * @param updatedData The updated data for the item
   * @param asyncAction The async action to perform
   * @param options Additional options for the optimistic update
   */
  const optimisticCollectionUpdate = useCallback(
    async <U extends { id: string | number }>(
      collection: U[],
      itemId: string | number,
      updatedData: Partial<U>,
      asyncAction: () => Promise<U[]>,
      options: Omit<OptimisticUpdateOptions<U[]>, 'optimisticValue'> = {}
    ) => {
      // Create optimistic collection by updating the specific item
      const optimisticCollection = collection.map(item => 
        item.id === itemId ? { ...item, ...updatedData } : item
      );
      
      return optimisticUpdate(
        asyncAction,
        {
          optimisticValue: optimisticCollection,
          ...options
        }
      );
    },
    [optimisticUpdate]
  );
  
  /**
   * Adds an item to a collection optimistically
   * @param collection The collection to update
   * @param newItem The new item to add
   * @param asyncAction The async action to perform
   * @param options Additional options for the optimistic update
   */
  const optimisticCollectionAdd = useCallback(
    async <U extends { id?: string | number }>(
      collection: U[],
      newItem: U,
      asyncAction: () => Promise<U[]>,
      options: Omit<OptimisticUpdateOptions<U[]>, 'optimisticValue'> = {}
    ) => {
      // Create a temporary ID for the new item if it doesn't have one
      const tempItem = { 
        ...newItem, 
        id: newItem.id || `temp-${Date.now()}`
      };
      
      // Add the new item to the collection
      const optimisticCollection = [...collection, tempItem];
      
      return optimisticUpdate(
        asyncAction,
        {
          optimisticValue: optimisticCollection,
          ...options
        }
      );
    },
    [optimisticUpdate]
  );
  
  /**
   * Removes an item from a collection optimistically
   * @param collection The collection to update
   * @param itemId The ID of the item to remove
   * @param asyncAction The async action to perform
   * @param options Additional options for the optimistic update
   */
  const optimisticCollectionRemove = useCallback(
    async <U extends { id: string | number }>(
      collection: U[],
      itemId: string | number,
      asyncAction: () => Promise<U[]>,
      options: Omit<OptimisticUpdateOptions<U[]>, 'optimisticValue'> = {}
    ) => {
      // Remove the item from the collection
      const optimisticCollection = collection.filter(item => item.id !== itemId);
      
      return optimisticUpdate(
        asyncAction,
        {
          optimisticValue: optimisticCollection,
          ...options
        }
      );
    },
    [optimisticUpdate]
  );

  return {
    state,
    setState,
    isLoading,
    error,
    optimisticUpdate,
    optimisticCollectionUpdate,
    optimisticCollectionAdd,
    optimisticCollectionRemove
  };
}
