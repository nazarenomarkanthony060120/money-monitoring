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

    return { authUrl, codeVerifier };
  }

  /**
   * Exchange authorization code for tokens using PKCE
   */
  async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<GoogleTokens> {
    try {
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

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json() as { error?: string; error_description?: string };
        throw new ApiError(
          tokenResponse.status,
          `Token exchange failed: ${errorData.error_description || errorData.error || 'Unknown error'}`
        );
      }

      return await tokenResponse.json() as GoogleTokens;
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
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.clientId
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new ApiError(401, 'Invalid ID token');
      }

      return {
        sub: payload.sub!,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture!,
        email_verified: payload.email_verified!,
      };
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

      return {
        token: authResult.token,
        user: authResult.user,
      };
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Google authentication failed');
    }
  }
}

export const googleOAuthService = new GoogleOAuthService(); 