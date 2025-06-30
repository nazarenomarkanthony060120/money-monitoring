import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { AuthProvider, User, LoginResponse } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

export const AUTH_PROVIDERS: AuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '🔍',
    color: '#4285F4',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    color: '#5865F2',
  },
];

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const FACEBOOK_CLIENT_ID = 'YOUR_FACEBOOK_CLIENT_ID';
const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';

const GOOGLE_REDIRECT_URI = makeRedirectUri({
  scheme: 'frontends',
  path: 'auth/google',
});

const FACEBOOK_REDIRECT_URI = makeRedirectUri({
  scheme: 'frontends',
  path: 'auth/facebook',
});

const DISCORD_REDIRECT_URI = makeRedirectUri({
  scheme: 'frontends',
  path: 'auth/discord',
});

class AuthService {
  private async exchangeCodeForToken(
    code: string,
    provider: 'google' | 'facebook' | 'discord'
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
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: GOOGLE_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
    });
    const result = await request.promptAsync(discovery);
    if (result.type === 'success' && result.params.code) {
      return this.exchangeCodeForToken(result.params.code, 'google');
    }
    throw new Error('Google authentication failed');
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
}

export const authService = new AuthService(); 