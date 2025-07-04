import { createHash, randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { ApiError } from '../utils/errors';
import { env } from '../config/environment';
import { authService } from './authService';

interface PKCECodes {
  codeVerifier: string;
  codeChallenge: string;
}

interface GoogleTokens {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

interface AuthResult {
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

export class GoogleOAuthService {
  private googleClient: OAuth2Client;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = env.GOOGLE_CLIENT_ID;
    this.clientSecret = env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = `${env.BACKEND_BASE_URL}/api/auth/google/callback`;
    this.googleClient = new OAuth2Client(this.clientId);

    // Log configuration for debugging
    console.log('Google OAuth Configuration:', {
      clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : 'NOT SET',
      clientSecret: this.clientSecret ? 'SET' : 'NOT SET',
      redirectUri: this.redirectUri,
      backendBaseUrl: env.BACKEND_BASE_URL,
    });
  }

  /**
   * Generate PKCE code verifier and challenge
   */
  private generatePKCECodes(): PKCECodes {
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    return { codeVerifier, codeChallenge };
  }

  /**
   * Generate Google OAuth URL with PKCE
   */
  generateAuthUrl(): { authUrl: string; codeVerifier: string } {
    const { codeVerifier, codeChallenge } = this.generatePKCECodes();
    const state = randomBytes(16).toString('base64url');

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log('Generated OAuth URL:', {
      authUrl: authUrl.substring(0, 100) + '...',
      codeVerifier: codeVerifier.substring(0, 20) + '...',
      state: state,
    });

    return { authUrl, codeVerifier };
  }

  /**
   * Exchange authorization code for tokens using PKCE
   */
  async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<GoogleTokens> {
    try {
      console.log('Exchanging code for tokens:', {
        code: code.substring(0, 20) + '...',
        codeVerifier: codeVerifier.substring(0, 20) + '...',
        redirectUri: this.redirectUri,
        clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : 'NOT SET',
      });

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      console.log('Token exchange response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json() as { error?: string; error_description?: string };
        console.error('Token exchange failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorData.error,
          errorDescription: errorData.error_description,
        });

        throw new ApiError(
          tokenResponse.status,
          `Token exchange failed: ${errorData.error_description || errorData.error || 'Unknown error'}`
        );
      }

      const tokens = await tokenResponse.json() as GoogleTokens;
      console.log('Token exchange successful:', {
        hasAccessToken: !!tokens.access_token,
        hasIdToken: !!tokens.id_token,
        hasRefreshToken: !!tokens.refresh_token,
        expiresIn: tokens.expires_in,
      });

      return tokens;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Token exchange failed');
    }
  }

  /**
   * Verify Google ID token and extract user info
   */
  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      console.log('Verifying ID token:', {
        idToken: idToken.substring(0, 50) + '...',
        clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : 'NOT SET',
      });

      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.clientId
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new ApiError(401, 'Invalid ID token');
      }

      const userInfo = {
        sub: payload.sub!,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture!,
        email_verified: payload.email_verified!,
      };

      console.log('ID token verified successfully:', {
        userId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        emailVerified: userInfo.email_verified,
      });

      return userInfo;
    } catch (error) {
      console.error('ID token verification error:', error);
      throw new ApiError(401, 'Invalid ID token');
    }
  }

  /**
   * Complete OAuth flow: exchange code for tokens, verify ID token, create user session
   */
  async authenticateUser(code: string, codeVerifier: string): Promise<AuthResult> {
    try {
      console.log('Starting Google authentication flow');

      // Step 1: Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier);

      // Step 2: Verify ID token and get user info
      const userInfo = await this.verifyIdToken(tokens.id_token);

      // Step 3: Create or update user and generate session
      const authResult = await authService.loginWithGoogle({
        idToken: tokens.id_token,
        accessToken: tokens.access_token,
        user: {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture,
        }
      });

      console.log('Google authentication completed successfully:', {
        userId: authResult.user.id,
        userEmail: authResult.user.email,
        userName: authResult.user.name,
      });

      return {
        token: authResult.token,
        user: authResult.user,
      };
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Google authentication failed');
    }
  }

  /**
   * Legacy method for web callback (without PKCE)
   */
  async handleLegacyCallback(code: string): Promise<AuthResult> {
    try {
      console.log('Handling legacy Google OAuth callback (without PKCE)');

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      console.log('Legacy token exchange response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json() as { error?: string; error_description?: string };
        console.error('Legacy token exchange failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorData.error,
          errorDescription: errorData.error_description,
        });

        throw new ApiError(
          tokenResponse.status,
          `Legacy token exchange failed: ${errorData.error_description || errorData.error || 'Unknown error'}`
        );
      }

      const tokens = await tokenResponse.json() as GoogleTokens;

      // If we have an ID token, verify it; otherwise get user info from userinfo endpoint
      let userInfo: GoogleUserInfo;

      if (tokens.id_token) {
        userInfo = await this.verifyIdToken(tokens.id_token);
      } else {
        // Fallback to userinfo endpoint
        const profileResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
        );

        if (!profileResponse.ok) {
          throw new ApiError(500, 'Failed to fetch user profile');
        }

        const profile = await profileResponse.json() as any;
        userInfo = {
          sub: profile.id,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          email_verified: profile.verified_email || true,
        };
      }

      // Create user session
      const authResult = await authService.loginWithGoogle({
        idToken: tokens.id_token || '',
        accessToken: tokens.access_token,
        user: {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture,
        }
      });

      return {
        token: authResult.token,
        user: authResult.user,
      };
    } catch (error) {
      console.error('Legacy Google OAuth callback error:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Google authentication failed');
    }
  }
}

export const googleOAuthService = new GoogleOAuthService(); 