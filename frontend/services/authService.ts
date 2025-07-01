import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { AuthProvider, User, LoginResponse } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

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

const FACEBOOK_CLIENT_ID = 'YOUR_FACEBOOK_CLIENT_ID';
const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';

const FACEBOOK_REDIRECT_URI = makeRedirectUri({
  scheme: 'frontend',
  path: 'auth/facebook',
});

const DISCORD_REDIRECT_URI = makeRedirectUri({
  scheme: 'frontend',
  path: 'auth/discord',
});

class AuthService {
  constructor() {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_SIGNIN_ANDROID_CLIENT_ID || '',
    });
  }

  private async exchangeCodeForToken(
    code: string,
    provider: 'facebook' | 'discord'
  ): Promise<LoginResponse> {
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email: `user@${provider}.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      avatar: `https://via.placeholder.com/150/000000/FFFFFF/?text=${provider.charAt(0).toUpperCase()}`,
      provider,
    };
    return {
      user: mockUser,
      token: `mock_token_${provider}_${Date.now()}`,
    };
  }

  async loginWithGoogle(): Promise<LoginResponse> {
    try {
      // Check Play Services (Android only)
      await GoogleSignin.hasPlayServices();

      // Try to sign in
      const userInfo = await GoogleSignin.signIn();

      // Create user object from Google Sign-In response
      const user: User = {
        id: (userInfo as any).user?.id || `google_${Date.now()}`,
        email: (userInfo as any).user?.email || '',
        name: (userInfo as any).user?.name || '',
        avatar: (userInfo as any).user?.photo || '',
        provider: 'google',
      };

      return {
        user,
        token: (userInfo as any).idToken || '',
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            throw new Error('Google sign-in was cancelled');
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            throw new Error('Google Play Services not available or outdated');
          case statusCodes.SIGN_IN_REQUIRED:
            throw new Error('User needs to sign in again');
          default:
            throw new Error('Google authentication failed');
        }
      }

      throw new Error('Google authentication failed');
    }
  }

  async loginWithFacebook(): Promise<LoginResponse> {
    const discovery = {
      authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    };
    const request = new AuthSession.AuthRequest({
      clientId: FACEBOOK_CLIENT_ID,
      scopes: ['public_profile', 'email'],
      redirectUri: FACEBOOK_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
    });
    const result = await request.promptAsync(discovery);
    if (result.type === 'success' && result.params.code) {
      return this.exchangeCodeForToken(result.params.code, 'facebook');
    }
    throw new Error('Facebook authentication failed');
  }

  async loginWithDiscord(): Promise<LoginResponse> {
    const discovery = {
      authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
      tokenEndpoint: 'https://discord.com/api/oauth2/token',
    };
    const request = new AuthSession.AuthRequest({
      clientId: DISCORD_CLIENT_ID,
      scopes: ['identify', 'email'],
      redirectUri: DISCORD_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
    });
    const result = await request.promptAsync(discovery);
    if (result.type === 'success' && result.params.code) {
      return this.exchangeCodeForToken(result.params.code, 'discord');
    }
    throw new Error('Discord authentication failed');
  }

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

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  async revokeAccess(userId: string): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error('Revoke access error:', error);
    }
  }
}

export const authService = new AuthService(); 