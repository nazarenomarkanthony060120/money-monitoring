import * as AuthSession from 'expo-auth-session';
import { User } from '../types/auth';
import { reportApiError, reportSilentError } from '../utils/errorReporting';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface GoogleAuthResult {
  token: string;
  user: User;
}

export interface GoogleOAuthUrlResponse {
  authUrl: string;
  codeVerifier: string;
}

export interface GoogleOAuthCallbackData {
  token: string;
  user: User;
}

export class GoogleAuthService {
  /**
   * Generate mobile redirect URI for the current environment
   */
  static generateMobileRedirectUri(): string {
    return AuthSession.makeRedirectUri({
      scheme: process.env.EXPO_PUBLIC_SCHEME || 'moneymonitoring',
      path: 'oauth/callback',
    });
  }

  /**
   * Get Google OAuth URL with PKCE from backend
   */
  static async getOAuthUrl(): Promise<GoogleOAuthUrlResponse> {
    const mobileRedirectUri = this.generateMobileRedirectUri();
    console.log('Mobile redirect URI:', mobileRedirectUri);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/google/url?redirectUri=${encodeURIComponent(mobileRedirectUri)}`
      );

      if (!response.ok) {
        const error = new Error(`Failed to get Google OAuth URL: ${response.status} ${response.statusText}`);
        reportApiError(error, '/api/auth/google/url', {
          severity: 'high',
        });
        throw error;
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        const error = new Error('Invalid response from server');
        reportApiError(error, '/api/auth/google/url', {
          severity: 'medium',
        });
        throw error;
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('Failed to get Google OAuth URL')) {
        reportApiError(error, '/api/auth/google/url', {
          severity: 'high',
        });
      }
      throw error;
    }
  }

  /**
   * Exchange authorization code for tokens using PKCE
   */
  static async exchangeCodeForTokens(
    code: string,
    codeVerifier: string,
    state?: string
  ): Promise<GoogleAuthResult> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          codeVerifier,
          state,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Token exchange failed');
        reportApiError(error, '/api/auth/google/token', {
          severity: 'high',
        });
        throw error;
      }

      const tokenData = await response.json();

      if (!tokenData.success || !tokenData.data) {
        const error = new Error(tokenData.message || 'Authentication failed');
        reportApiError(error, '/api/auth/google/token', {
          severity: 'high',
        });
        throw error;
      }

      return tokenData.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('Token exchange failed') && !error.message.includes('Authentication failed')) {
        reportApiError(error, '/api/auth/google/token', {
          severity: 'critical',
        });
      }
      throw error;
    }
  }

  /**
   * Parse authentication result from callback URL
   */
  static parseCallbackUrl(callbackUrl: string): {
    type: 'token' | 'code';
    data: GoogleOAuthCallbackData | { code: string; state?: string };
  } {
    try {
      const url = new URL(callbackUrl);
      const token = url.searchParams.get('token');
      const success = url.searchParams.get('success');

      // Check if this is a direct token callback (web callback flow)
      if (token && success === 'true') {
        console.log('Received token from web callback:', token.substring(0, 20) + '...');

        // Parse user info from URL parameters
        const userParam = url.searchParams.get('user');
        let user: User = {
          id: 'unknown',
          name: 'User',
          email: 'user@example.com',
          provider: 'google',
        };

        if (userParam) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(userParam));
            user = {
              id: parsedUser.id || 'unknown',
              name: parsedUser.name || 'User',
              email: parsedUser.email || 'user@example.com',
              avatar: parsedUser.picture,
              provider: parsedUser.provider || 'google',
            };
            console.log('Parsed user info from callback:', {
              id: user.id,
              name: user.name,
              email: user.email,
            });
          } catch (error) {
            console.warn('Failed to parse user info from callback:', error);
            reportSilentError(error as Error, {
              action: 'Parse user info from Google OAuth callback',
              severity: 'low',
            });
          }
        }

        return {
          type: 'token',
          data: { token, user },
        };
      }

      // Extract authorization code for mobile PKCE flow
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) {
        const error = new Error('No authorization code or token received');
        reportSilentError(error, {
          action: 'Parse Google OAuth callback URL',
          severity: 'medium',
        });
        throw error;
      }

      console.log('Received authorization code, proceeding with PKCE flow');

      return {
        type: 'code',
        data: { code, state: state || undefined },
      };
    } catch (error) {
      if (error instanceof Error && !error.message.includes('No authorization code or token received')) {
        reportSilentError(error, {
          action: 'Parse Google OAuth callback URL',
          severity: 'medium',
        });
      }
      throw error;
    }
  }
}

export const googleAuthService = GoogleAuthService; 