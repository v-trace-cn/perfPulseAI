import { useState, useCallback } from 'react';

type ApiState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

type ApiResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
};

/**
 * Custom hook for making API calls with loading and error states
 * @param apiFunction The API function to call
 * @returns Object containing data, loading state, error state, and execute function
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): ApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setState({ data: null, isLoading: true, error: null });
        const data = await apiFunction(...args);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (error: any) {
        const errorMessage = error.message || '请求失败，请稍后再试';
        setState({ data: null, isLoading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
