import axios from 'axios';
import { Platform } from 'react-native';

export interface FrontendErrorPayload {
  error: string;
  message: string;
  stack?: string;
  userId?: string;
  page?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  source: 'frontend';
  deviceInfo?: {
    platform?: string;
    version?: string;
    model?: string;
  };
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields: DiscordEmbedField[];
  timestamp: string;
  footer?: {
    text: string;
  };
}

export interface DiscordWebhookPayload {
  content?: string;
  embeds: DiscordEmbed[];
}

class FrontendDiscordService {
  private webhookUrl: string;

  constructor() {
    // Get webhook URL from backend API
    this.webhookUrl = (process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/error/discord';
  }

  /**
   * Send error to Discord via backend proxy
   */
  async sendErrorToDiscord(errorPayload: FrontendErrorPayload): Promise<void> {
    try {
      // Don't send errors in development unless it's a critical error
      if (__DEV__ && !errorPayload.message.includes('Critical')) {
        console.warn('Frontend error (not sent to Discord in dev):', errorPayload);
        return;
      }

      // Send to backend which will forward to Discord
      await axios.post(this.webhookUrl, errorPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      console.log('Error successfully sent to Discord via backend');
    } catch (error) {
      console.error('Failed to send error to Discord:', error);
      // Don't throw to prevent infinite loop
    }
  }

  /**
   * Create error payload from Error object
   */
  createErrorPayload(
    error: Error,
    additionalInfo?: {
      userId?: string;
      page?: string;
      deviceInfo?: FrontendErrorPayload['deviceInfo'];
    }
  ): FrontendErrorPayload {
    return {
      error: error.name || 'UnknownError',
      message: error.message || 'No error message',
      stack: error.stack,
      userId: additionalInfo?.userId,
      page: additionalInfo?.page || (typeof window !== 'undefined' ? window.location.pathname : 'unknown'),
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : `React Native ${Platform.OS}`,
      url: typeof window !== 'undefined' ? window.location.href : 'react-native-app',
      source: 'frontend',
      deviceInfo: additionalInfo?.deviceInfo || {
        platform: Platform.OS,
        version: Platform.Version.toString(),
      },
    };
  }

  /**
 * Handle uncaught errors
 */
  setupGlobalErrorHandlers(userId?: string): void {
    // Only setup web-specific error handlers if window is available
    if (typeof window !== 'undefined') {
      // Handle uncaught JavaScript errors
      window.addEventListener('error', (event) => {
        const errorPayload = this.createErrorPayload(
          new Error(event.message),
          {
            userId,
            page: window.location.pathname,
          }
        );

        // Add additional error info
        errorPayload.message = `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;

        this.sendErrorToDiscord(errorPayload);
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        const errorPayload = this.createErrorPayload(error, {
          userId,
          page: window.location.pathname,
        });

        errorPayload.message = `Unhandled Promise Rejection: ${errorPayload.message}`;

        this.sendErrorToDiscord(errorPayload);
      });
    }

    // Setup React Native error handlers
    if (Platform.OS !== 'web') {
      // React Native global error handler
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const errorMessage = args.join(' ');
        if (errorMessage.includes('Error:') || errorMessage.includes('Warning:')) {
          const error = new Error(errorMessage);
          const errorPayload = this.createErrorPayload(error, { userId });
          this.sendErrorToDiscord(errorPayload);
        }
        originalConsoleError.apply(console, args);
      };
    }

    console.log('Global error handlers setup for Discord notifications');
  }

  /**
   * Manually send custom error
   */
  async sendCustomError(
    title: string,
    message: string,
    additionalInfo?: {
      userId?: string;
      page?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
    }
  ): Promise<void> {
    const error = new Error(message);
    error.name = title;

    const errorPayload = this.createErrorPayload(error, {
      userId: additionalInfo?.userId,
      page: additionalInfo?.page,
    });

    // Mark as critical if specified
    if (additionalInfo?.severity === 'critical') {
      errorPayload.message = `Critical: ${errorPayload.message}`;
    }

    await this.sendErrorToDiscord(errorPayload);
  }
}

export const frontendDiscordService = new FrontendDiscordService(); 