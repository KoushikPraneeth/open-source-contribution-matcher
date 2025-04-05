
import { useState, useCallback } from 'react';

type OptimisticUpdateOptions<T> = {
  optimisticValue: T;
  rollbackOnError?: boolean;
};

/**
 * Hook for handling optimistic UI updates
 * @param initialState The initial state value
 */
export function useOptimisticState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [previousState, setPreviousState] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Updates the state optimistically before the async action completes
   * @param asyncAction The async action to perform
   * @param options Options for the optimistic update
   */
  const optimisticUpdate = useCallback(
    async (
      asyncAction: () => Promise<T>,
      { optimisticValue, rollbackOnError = true }: OptimisticUpdateOptions<T>
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
        return result;
      } catch (err) {
        // Handle errors
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Rollback if specified
        if (rollbackOnError && previousState !== null) {
          setState(previousState);
        }
        
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [state, previousState]
  );

  return {
    state,
    setState,
    isLoading,
    error,
    optimisticUpdate,
  };
}
