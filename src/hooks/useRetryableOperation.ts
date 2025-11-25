import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RetryableOperationOptions {
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook to manage retryable operations with exponential backoff
 */
export const useRetryableOperation = () => {
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = async <T>(
    operation: () => Promise<{ success: boolean; error?: string; data?: T }>,
    options: RetryableOperationOptions = {}
  ): Promise<{ success: boolean; data?: T }> => {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      onSuccess,
      onError,
    } = options;

    let lastError = '';
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        
        if (result.success) {
          if (attempt > 0) {
            toast({
              title: "Success!",
              description: "Operation completed successfully after retry.",
            });
          }
          onSuccess?.();
          return { success: true, data: result.data };
        }
        
        lastError = result.error || 'Unknown error';
        
        // If this was the last attempt, break
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        setIsRetrying(true);
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        setIsRetrying(false);
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Network error';
        
        if (attempt === maxRetries) {
          break;
        }
        
        setIsRetrying(true);
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        setIsRetrying(false);
      }
    }
    
    // All retries failed
    onError?.(lastError);
    return { success: false };
  };

  return { executeWithRetry, isRetrying };
};
