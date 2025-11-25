import { toast } from '@/hooks/use-toast';

/**
 * Centralized error handler for React Query operations
 */
export const handleQueryError = (error: unknown, context?: string) => {
  console.error(`Query error${context ? ` in ${context}` : ''}:`, error);

  const isNetworkError = 
    error instanceof Error && 
    (error.message?.includes('fetch') || error.message?.includes('network'));

  const isAuthError = 
    error instanceof Error && 
    (error.message?.includes('JWT') || error.message?.includes('auth'));

  if (!navigator.onLine || isNetworkError) {
    toast({
      title: "Connection Error",
      description: "Please check your internet connection and try again.",
      variant: "destructive",
    });
  } else if (isAuthError) {
    toast({
      title: "Session Expired",
      description: "Please sign in again to continue.",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Something went wrong",
      description: error instanceof Error ? error.message : "Please try refreshing the page.",
      variant: "destructive",
    });
  }
};

/**
 * Enhanced retry logic for React Query
 */
export const getRetryConfig = () => ({
  retry: (failureCount: number, error: unknown) => {
    // Don't retry on auth errors
    if (error instanceof Error && error.message?.includes('auth')) {
      return false;
    }
    
    // Don't retry if offline
    if (!navigator.onLine) {
      return false;
    }
    
    // Retry up to 2 times for network errors
    if (failureCount < 2) {
      return true;
    }
    
    return false;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
});
