import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { AuthProvider, User, LoginResponse } from '../types/auth';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

// Conditionally import Google Sign-in only if available
let GoogleSignin: any = null;
let statusCodes: any = null;

try {
  const GoogleSigninModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSigninModule.GoogleSignin;
  statusCodes = GoogleSigninModule.statusCodes;
} catch (error) {
  console.warn('Google Sign-in module not available in Expo Go. Using web-based OAuth instead.');
}

WebBrowser.maybeCompleteAuthSession();

// Configuration
const BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Auth providers configuration
export const AUTH_PROVIDERS: AuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '',
    color: '#4285F4',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '',
    color: '#1877F2',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '',
    color: '#5865F2',
  },
];

class AuthService {
  private linkingSubscription: any = null;

  constructor() {
    this.initializeGoogleSignIn();
    this.setupLinkingListener();
  }

  private initializeGoogleSignIn(): void {
    // Disable native GoogleSignin to avoid conflicts with web-based OAuth flow
    // Using web-based OAuth flow for all platforms (recommended for Expo)
    console.log('Using web-based Google OAuth flow (recommended for Expo)');

    // If you need native GoogleSignin for standalone apps, uncomment and configure:
    // if (GoogleSignin && Constants.appOwnership !== 'expo') {
    //   try {
    //     const googleClientId = process.env.GOOGLE_CLIENT_ID;
    //     if (googleClientId) {
    //       GoogleSignin.configure({ webClientId: googleClientId });
    //     }
    //   } catch (error) {
    //     console.warn('Failed to configure Google Sign-in:', error);
    //   }
    // }
  }

  private setupLinkingListener(): void {
    // Listen for incoming links (OAuth callbacks)
    this.linkingSubscription = Linking.addEventListener('url', this.handleIncomingLink);
  }

  private handleIncomingLink = (event: { url: string }) => {
    const url = new URL(event.url);
    const token = url.searchParams.get('token');
    const userParam = url.searchParams.get('user');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        // You can emit an event or use a callback to notify the app
        // For now, we'll store it in a way that can be accessed
        this.handleSuccessfulOAuth({ user, token });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  };

  private handleSuccessfulOAuth(result: LoginResponse): void {
    // Store the authentication result
    // You might want to use AsyncStorage or a state management solution
    console.log('OAuth successful:', result);
  }

  // Google Sign-In using expo-web-browser (simpler approach)
  async loginWithGoogle(): Promise<LoginResponse> {
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/google/url`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get Google auth URL');
      }

      // Create redirect URI
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'moneymonitoring',
        path: 'auth/callback'
      });

      // Use WebBrowser for OAuth (works reliably across all platforms)
      const result = await WebBrowser.openAuthSessionAsync(
        data.data.authUrl,
        redirectUri
      );

      if (result.type === 'success') {
        // Parse the result URL to extract token and user data
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const userParam = url.searchParams.get('user');
        const error = url.searchParams.get('error');

        if (error) {
          throw new Error(`Google authentication failed: ${error}`);
        }

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { user, token };
        }
      }

      throw new Error('Google authentication was cancelled or failed');
    } catch (error) {
      console.error('Frontend Google authentication error:', error);
      // Send error to Discord
      this.sendErrorToDiscord('Google Authentication Error', error);
      throw new Error('Google authentication failed');
    }
  }

  // Facebook Sign-In using expo-web-browser
  async loginWithFacebook(): Promise<LoginResponse> {
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/facebook/url`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get Facebook auth URL');
      }

      // Create redirect URI
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'moneymonitoring',
        path: 'auth/callback'
      });

      // Use WebBrowser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(
        data.data.authUrl,
        redirectUri
      );

      if (result.type === 'success') {
        // Parse the result URL to extract token and user data
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const userParam = url.searchParams.get('user');
        const error = url.searchParams.get('error');

        if (error) {
          throw new Error(`Facebook authentication failed: ${error}`);
        }

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { user, token };
        }
      }

      throw new Error('Facebook authentication was cancelled or failed');
    } catch (error) {
      console.error('Facebook authentication error:', error);
      // Send error to Discord
      this.sendErrorToDiscord('Facebook Authentication Error', error);
      throw new Error('Facebook authentication failed');
    }
  }

  // Discord Sign-In using expo-web-browser
  async loginWithDiscord(): Promise<LoginResponse> {
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/discord/url`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get Discord auth URL');
      }

      // Create redirect URI
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'moneymonitoring',
        path: 'auth/callback'
      });

      // Use WebBrowser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(
        data.data.authUrl,
        redirectUri
      );

      if (result.type === 'success') {
        // Parse the result URL to extract token and user data
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const userParam = url.searchParams.get('user');
        const error = url.searchParams.get('error');

        if (error) {
          throw new Error(`Discord authentication failed: ${error}`);
        }

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { user, token };
        }
      }

      throw new Error('Discord authentication was cancelled or failed');
    } catch (error) {
      console.error('Discord authentication error:', error);
      // Send error to Discord
      this.sendErrorToDiscord('Discord Authentication Error', error);
      throw new Error('Discord authentication failed');
    }
  }

  // Main authentication method
  async loginWithProvider(provider: 'google' | 'facebook' | 'discord'): Promise<LoginResponse> {
    switch (provider) {
      case 'google':
        return this.loginWithGoogle();
      case 'facebook':
        return this.loginWithFacebook();
      case 'discord':
        return this.loginWithDiscord();
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  // Sign out functionality
  async signOut(): Promise<void> {
    try {
      // Native GoogleSignin disabled - using web-based OAuth flow only
      // if (GoogleSignin && Constants.appOwnership !== 'expo') {
      //   await GoogleSignin.signOut();
      // }
      await this.sendLogoutToBackend();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  private async sendLogoutToBackend(): Promise<void> {
    await fetch(`${BACKEND_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Revoke access functionality
  async revokeAccess(userId: string): Promise<void> {
    try {
      // Native GoogleSignin disabled - using web-based OAuth flow only
      // if (GoogleSignin && Constants.appOwnership !== 'expo') {
      //   await GoogleSignin.revokeAccess();
      // }
      await this.sendRevokeToBackend(userId);
    } catch (error) {
      console.error('Revoke access error:', error);
    }
  }

  private async sendRevokeToBackend(userId: string): Promise<void> {
    await fetch(`${BACKEND_BASE_URL}/api/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  }

  // Cleanup method
  cleanup(): void {
    if (this.linkingSubscription) {
      this.linkingSubscription.remove();
    }
  }

  // Helper method to send errors to Discord
  private async sendErrorToDiscord(title: string, error: any): Promise<void> {
    try {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorPayload = {
        error: title,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'React Native',
        url: 'react-native-app',
        source: 'frontend' as const,
        page: 'Login',
      };

      const response = await fetch(`${BACKEND_BASE_URL}/api/error/discord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorPayload),
      });

      if (!response.ok) {
        console.error('Failed to send error to Discord:', response.status);
      }
    } catch (discordError) {
      console.error('Error sending to Discord:', discordError);
    }
  }
}

export const authService = new AuthService(); 