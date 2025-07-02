import * as WebBrowser from 'expo-web-browser';
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
const BACKEND_BASE_URL = Constants.expoConfig?.extra?.backendApiUrl || 'http://localhost:5000';

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
    if (GoogleSignin) {
      try {
        GoogleSignin.configure({
          webClientId: process.env.GOOGLE_SIGNIN_ANDROID_CLIENT_ID || '',
        });
      } catch (error) {
        console.warn('Failed to configure Google Sign-in:', error);
      }
    }
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

  // Google Sign-In (fallback to web-based OAuth if native module not available)
  async loginWithGoogle(): Promise<LoginResponse> {
    if (GoogleSignin) {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const authData = this.prepareGoogleAuthData(userInfo);
        return await this.sendToBackend('google', authData);
      } catch (error: any) {
        throw this.handleGoogleError(error);
      }
    } else {
      // Fallback to web-based OAuth
      return this.loginWithGoogleWeb();
    }
  }

  // Web-based Google OAuth (for Expo Go)
  private async loginWithGoogleWeb(): Promise<LoginResponse> {
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/google/url`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get Google auth URL');
      }

      // Open browser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(data.data.authUrl, 'moneymonitoring://');

      if (result.type === 'success') {
        // Parse the result URL to extract token and user data
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const userParam = url.searchParams.get('user');

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { user, token };
        }
      }

      throw new Error('Google authentication failed');
    } catch (error) {
      console.error('Google authentication error:', error);
      throw new Error('Google authentication failed');
    }
  }

  private prepareGoogleAuthData(userInfo: any): any {
    return {
      idToken: (userInfo as any).idToken,
      accessToken: (userInfo as any).accessToken,
      user: {
        id: (userInfo as any).user?.id,
        email: (userInfo as any).user?.email,
        name: (userInfo as any).user?.name,
        photo: (userInfo as any).user?.photo,
        provider: 'google',
      },
    };
  }

  private handleGoogleError(error: any): Error {
    console.error('Google Sign-In Error:', error);

    if (error.code && statusCodes) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return new Error('Google sign-in was cancelled');
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return new Error('Google Play Services not available or outdated');
        case statusCodes.SIGN_IN_REQUIRED:
          return new Error('User needs to sign in again');
        default:
          return new Error('Google authentication failed');
      }
    }

    return new Error('Google authentication failed');
  }

  // Facebook Sign-In (handled by backend)
  async loginWithFacebook(): Promise<LoginResponse> {
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/facebook/url`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get Facebook auth URL');
      }

      // Open browser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(data.data.authUrl, 'moneymonitoring://');

      if (result.type === 'success') {
        // Parse the result URL to extract token and user data
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const userParam = url.searchParams.get('user');

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { user, token };
        }
      }

      throw new Error('Facebook authentication failed');
    } catch (error) {
      console.error('Facebook authentication error:', error);
      throw new Error('Facebook authentication failed');
    }
  }

  // Discord Sign-In (handled by backend)
  async loginWithDiscord(): Promise<LoginResponse> {
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/discord/url`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get Discord auth URL');
      }

      // Open browser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(data.data.authUrl, 'moneymonitoring://');

      if (result.type === 'success') {
        // Parse the result URL to extract token and user data
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const userParam = url.searchParams.get('user');

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { user, token };
        }
      }

      throw new Error('Discord authentication failed');
    } catch (error) {
      console.error('Discord authentication error:', error);
      throw new Error('Discord authentication failed');
    }
  }

  // Generic backend communication
  private async sendToBackend(provider: string, authData: any): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/login/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });

      if (!response.ok) {
        throw new Error(`Backend authentication failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw new Error('Failed to authenticate with backend');
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
      if (GoogleSignin) {
        await GoogleSignin.signOut();
      }
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
      if (GoogleSignin) {
        await GoogleSignin.revokeAccess();
      }
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
}

export const authService = new AuthService(); 