import { useCallback } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from './useAuth';
import {
  ErrorReporter,
  ErrorContext,
  ErrorReportingOptions,
  reportAuthError,
  reportApiError,
  reportCriticalError,
  reportSilentError
} from '../utils/errorReporting';

interface UseErrorReportingReturn {
  // Main error reporting function
  reportError: (error: Error | string, context?: ErrorContext, options?: ErrorReportingOptions) => Promise<void>;

  // Specialized error reporting functions
  reportAuthError: (error: Error | string, provider: string, context?: Omit<ErrorContext, 'action'>) => void;
  reportApiError: (error: Error | string, endpoint: string, context?: Omit<ErrorContext, 'action'>) => void;
  reportCriticalError: (error: Error | string, context?: ErrorContext) => void;
  reportSilentError: (error: Error | string, context?: ErrorContext) => void;

  // Higher-order functions for wrapping async operations
  wrapAsync: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorContext?: ErrorContext
  ) => (...args: T) => Promise<R>;

  wrapApiCall: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    endpoint: string,
    errorContext?: Omit<ErrorContext, 'action'>
  ) => (...args: T) => Promise<R>;
}

/**
 * Hook for comprehensive error reporting with automatic context
 */
export const useErrorReporting = (): UseErrorReportingReturn => {
  const { user } = useAuth();
  const pathname = usePathname();

  // Get base context for all error reports
  const getBaseContext = useCallback((context: ErrorContext = {}): ErrorContext => ({
    userId: context.userId || user?.id,
    page: context.page || pathname,
    ...context,
  }), [user?.id, pathname]);

  // Main error reporting function with automatic context
  const reportError = useCallback(async (
    error: Error | string,
    context: ErrorContext = {},
    options: ErrorReportingOptions = {}
  ): Promise<void> => {
    const fullContext = getBaseContext(context);
    await ErrorReporter.reportError(error, fullContext, options);
  }, [getBaseContext]);

  // Specialized error reporting functions
  const reportAuthErrorWithContext = useCallback((
    error: Error | string,
    provider: string,
    context: Omit<ErrorContext, 'action'> = {}
  ): void => {
    const fullContext = getBaseContext(context);
    reportAuthError(error, provider, fullContext);
  }, [getBaseContext]);

  const reportApiErrorWithContext = useCallback((
    error: Error | string,
    endpoint: string,
    context: Omit<ErrorContext, 'action'> = {}
  ): void => {
    const fullContext = getBaseContext(context);
    reportApiError(error, endpoint, fullContext);
  }, [getBaseContext]);

  const reportCriticalErrorWithContext = useCallback((
    error: Error | string,
    context: ErrorContext = {}
  ): void => {
    const fullContext = getBaseContext(context);
    reportCriticalError(error, fullContext);
  }, [getBaseContext]);

  const reportSilentErrorWithContext = useCallback((
    error: Error | string,
    context: ErrorContext = {}
  ): void => {
    const fullContext = getBaseContext(context);
    reportSilentError(error, fullContext);
  }, [getBaseContext]);

  // Higher-order function to wrap async operations with error reporting
  const wrapAsync = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorContext: ErrorContext = {}
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        const fullContext = getBaseContext({
          action: errorContext.action || fn.name || 'Async Operation',
          ...errorContext,
        });

        await reportError(error as Error, fullContext, { showUserAlert: true });
        throw error; // Re-throw for component to handle
      }
    };
  }, [reportError, getBaseContext]);

  // Higher-order function specifically for API calls
  const wrapApiCall = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    endpoint: string,
    errorContext: Omit<ErrorContext, 'action'> = {}
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        const fullContext = getBaseContext({
          ...errorContext,
        });

        reportApiErrorWithContext(error as Error, endpoint, fullContext);
        throw error; // Re-throw for component to handle
      }
    };
  }, [reportApiErrorWithContext, getBaseContext]);

  return {
    reportError,
    reportAuthError: reportAuthErrorWithContext,
    reportApiError: reportApiErrorWithContext,
    reportCriticalError: reportCriticalErrorWithContext,
    reportSilentError: reportSilentErrorWithContext,
    wrapAsync,
    wrapApiCall,
  };
};

export default useErrorReporting; 