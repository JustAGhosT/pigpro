/**
 * Error handling utilities for the application
 */

export interface IAppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class AppError extends Error {
  public code?: string;
  public status?: number;
  public details?: any;

  constructor(message: string, code?: string, status?: number, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Wraps async functions with error handling
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorMessage = 'An error occurred'
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error in async function:', error);
      throw new AppError(
        error instanceof Error ? error.message : errorMessage,
        'ASYNC_ERROR',
        500,
        error
      );
    }
  };
};

/**
 * Safe API call wrapper
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  fallback?: T,
  errorMessage = 'API call failed'
): Promise<T | undefined> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw new AppError(
      error instanceof Error ? error.message : errorMessage,
      'API_ERROR',
      500,
      error
    );
  }
};

/**
 * Retry mechanism for failed operations
 */
export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries = 3,
  delay = 1000
) => {
  return async (...args: T): Promise<R> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw new AppError(
            `Operation failed after ${maxRetries} attempts: ${lastError.message}`,
            'RETRY_EXHAUSTED',
            500,
            lastError
          );
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  };
};

/**
 * Error logging utility
 */
export const logError = (error: Error, context?: string) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
  };
  
  console.error('Application Error:', errorInfo);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to error tracking service
    // errorTrackingService.captureException(error, { extra: errorInfo });
  }
};

/**
 * React hook for error handling
 */
import { useCallback, useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);
  
  const handleError = useCallback((error: Error | AppError) => {
    const appError = error instanceof AppError ? error : new AppError(error.message);
    setError(appError);
    logError(appError);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
};
