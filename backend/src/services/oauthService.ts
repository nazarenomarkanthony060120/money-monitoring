import { ApiError } from '../utils/errors';
import { env } from '../config/environment';
import { authService } from './authService';

interface OAuthUrlResponse {
  success: boolean;
  data?: {
    authUrl: string;
  };
  error?: string;
}

interface OAuthCallbackResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
    provider: string;
    isEmailVerified: boolean;
  };
}

export class OAuthService {
  private facebookClientId: string;
  private facebookClientSecret: string;
  private discordClientId: string;
  private discordClientSecret: string;
  private googleClientId: string;
  private googleClientSecret: string;
  private baseUrl: string;
  constructor() {
    this.facebookClientId = env.FACEBOOK_APP_ID;
    this.facebookClientSecret = env.FACEBOOK_APP_SECRET;
    this.discordClientId = env.DISCORD_CLIENT_ID;
    this.discordClientSecret = env.DISCORD_CLIENT_SECRET;
    this.googleClientId = env.GOOGLE_CLIENT_ID;
    this.googleClientSecret = env.GOOGLE_CLIENT_SECRET;
    this.baseUrl = env.BACKEND_BASE_URL || 'http://localhost:5000';
  }

  // Facebook OAuth
  async getFacebookAuthUrl(): Promise<OAuthUrlResponse> {
    const redirectUri = `${this.baseUrl}/api/auth/facebook/callback`;
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${this.facebookClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_profile,email&response_type=code`;

    return {
      success: true,
      data: {
        authUrl,
      },
    };
  }

  async handleFacebookCallback(code: string): Promise<OAuthCallbackResult> {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.facebookClientId,
          client_secret: this.facebookClientSecret,
          redirect_uri: `${this.baseUrl}/api/auth/facebook/callback`,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        throw new ApiError(401, 'Failed to exchange code for access token');
      }

      const tokenData = await tokenResponse.json() as any;
      const accessToken = tokenData.access_token;

      // Get user profile from Facebook
      const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);

      if (!profileResponse.ok) {
        throw new ApiError(401, 'Failed to get user profile from Facebook');
      }

      const profile = await profileResponse.json() as any;

      // Authenticate user using auth service
      const authResult = await authService.loginWithFacebook(accessToken, {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        photo: profile.picture?.data?.url,
      });

      return {
        token: authResult.token,
        user: authResult.user,
      };
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      throw error;
    }
  }

  // Discord OAuth
  async getDiscordAuthUrl(): Promise<OAuthUrlResponse> {
    const redirectUri = `${this.baseUrl}/api/auth/discord/callback`;
    const authUrl = authService.generateDiscordAuthUrl(redirectUri);

    return {
      success: true,
      data: {
        authUrl,
      },
    };
  }

  async handleDiscordCallback(code: string): Promise<OAuthCallbackResult> {
    try {
      const redirectUri = `${this.baseUrl}/api/auth/discord/callback`;

      // Use the new Discord authentication method from authService
      const authResult = await authService.loginWithDiscord(code, redirectUri);

      return {
        token: authResult.token,
        user: authResult.user,
      };
    } catch (error) {
      console.error('Discord OAuth error:', error);
      throw error;
    }
  }

  // Generate frontend redirect URL
  generateFrontendRedirect(result: OAuthCallbackResult): string {
    const frontendUrl = `${env.FRONTEND_URL}?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    return frontendUrl;
  }

  // Generate error redirect URL
  generateErrorRedirect(error: string): string {
    const errorUrl = `${env.FRONTEND_URL}?error=${error}`;
    return errorUrl;
  }

  // Generate Google OAuth URL
  generateGoogleOAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.googleClientId,
      redirect_uri: `${this.baseUrl}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string): Promise<OAuthCallbackResult> {
    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.googleClientId,
          client_secret: this.googleClientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${this.baseUrl}/api/auth/google/callback`,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens: any = await tokenResponse.json();

      // Get user profile
      const profileResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
      );

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profile: any = await profileResponse.json();

      // Use authService to handle Google authentication
      const authResult = await authService.loginWithGoogle({
        idToken: tokens.id_token || '',
        accessToken: tokens.access_token,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          photo: profile.picture,
        }
      });

      return {
        token: authResult.token,
        user: authResult.user,
      };
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      throw new Error('Google authentication failed');
    }
  }
}

export const oauthService = new OAuthService(); 