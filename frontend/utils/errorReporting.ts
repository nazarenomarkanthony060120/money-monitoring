import { Alert } from 'react-native';
import { frontendDiscordService } from '../services/discordService';

export interface ErrorContext {
  userId?: string;
  page?: string;
  action?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  showAlert?: boolean;
  alertTitle?: string;
  userMessage?: string;
}

export interface ErrorReportingOptions {
  logToConsole?: boolean;
  sendToDiscord?: boolean;
  showUserAlert?: boolean;
  isBlocking?: boolean;
}

/**
 * Comprehensive error reporting utility
 * Logs to console, sends to Discord, and optionally shows user alerts
 */
export class ErrorReporter {
  private static defaultOptions: ErrorReportingOptions = {
    logToConsole: true,
    sendToDiscord: true,
    showUserAlert: false,
    isBlocking: false,
  };

  /**
   * Report an error with full context and options
   */
  static async reportError(
    error: Error | string,
    context: ErrorContext = {},
    options: ErrorReportingOptions = {}
  ): Promise<void> {
    const finalOptions = { ...this.defaultOptions, ...options };
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Always log to console for debugging
    if (finalOptions.logToConsole) {
      console.error(`[${context.severity?.toUpperCase() || 'ERROR'}] ${context.action || 'Unknown action'}:`, {
        error: errorObj.message,
        page: context.page,
        userId: context.userId,
        stack: errorObj.stack,
      });
    }

    // Send to Discord (non-blocking)
    if (finalOptions.sendToDiscord) {
      this.sendToDiscordSafely(errorObj, context);
    }

    // Show user alert if requested
    if (finalOptions.showUserAlert || context.showAlert) {
      this.showUserAlert(errorObj, context);
    }
  }

  /**
   * Report API errors specifically
   */
  static async reportApiError(
    error: Error | string,
    endpoint: string,
    context: Omit<ErrorContext, 'action'> = {},
    options: ErrorReportingOptions = {}
  ): Promise<void> {
    await this.reportError(
      error,
      {
        ...context,
        action: `API Request to ${endpoint}`,
        severity: context.severity || 'medium',
      },
      options
    );
  }

  /**
   * Report authentication errors
   */
  static async reportAuthError(
    error: Error | string,
    provider: string,
    context: Omit<ErrorContext, 'action'> = {},
    options: ErrorReportingOptions = { showUserAlert: true }
  ): Promise<void> {
    await this.reportError(
      error,
      {
        ...context,
        action: `${provider} Authentication`,
        severity: context.severity || 'high',
        alertTitle: context.alertTitle || 'Sign In Failed',
        userMessage: context.userMessage || `${provider} sign in failed. Please try again.`,
      },
      options
    );
  }

  /**
   * Report critical errors that need immediate attention
   */
  static async reportCriticalError(
    error: Error | string,
    context: ErrorContext = {},
    options: ErrorReportingOptions = { showUserAlert: true }
  ): Promise<void> {
    await this.reportError(
      error,
      {
        ...context,
        severity: 'critical',
        alertTitle: context.alertTitle || 'Application Error',
        userMessage: context.userMessage || 'A critical error occurred. Please contact support if this persists.',
      },
      options
    );
  }

  /**
   * Safely send error to Discord without throwing
   */
  private static sendToDiscordSafely(error: Error, context: ErrorContext): void {
    try {
      frontendDiscordService.sendErrorToDiscord(
        frontendDiscordService.createErrorPayload(error, {
          userId: context.userId,
          page: context.page,
        })
      ).catch(discordError => {
        // Silently log Discord errors to avoid infinite loops
        console.warn('Failed to send error to Discord:', discordError);
      });
    } catch (discordError) {
      console.warn('Error in Discord reporting setup:', discordError);
    }
  }

  /**
   * Show user-friendly alert
   */
  private static showUserAlert(error: Error, context: ErrorContext): void {
    const title = context.alertTitle || 'Error';
    const message = context.userMessage || error.message || 'An unexpected error occurred.';

    Alert.alert(title, message, [
      { text: 'OK', style: 'default' }
    ]);
  }
}

/**
 * Quick utility functions for common error reporting scenarios
 */

// Simple error reporting with default options
export const reportError = (error: Error | string, context?: ErrorContext): void => {
  ErrorReporter.reportError(error, context).catch(console.warn);
};

// API error reporting
export const reportApiError = (error: Error | string, endpoint: string, context?: Omit<ErrorContext, 'action'>): void => {
  ErrorReporter.reportApiError(error, endpoint, context).catch(console.warn);
};

// Auth error reporting with user alert
export const reportAuthError = (error: Error | string, provider: string, context?: Omit<ErrorContext, 'action'>): void => {
  ErrorReporter.reportAuthError(error, provider, context).catch(console.warn);
};

// Critical error reporting
export const reportCriticalError = (error: Error | string, context?: ErrorContext): void => {
  ErrorReporter.reportCriticalError(error, context).catch(console.warn);
};

// Silent error reporting (no user alert, just logging and Discord)
export const reportSilentError = (error: Error | string, context?: ErrorContext): void => {
  ErrorReporter.reportError(error, context, { showUserAlert: false }).catch(console.warn);
}; 