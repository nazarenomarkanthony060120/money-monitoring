import { Request, Response } from 'express';
import { googleOAuthService } from '../services/googleOAuthService';
import { ApiError } from '../utils/errors';
import { env } from '../config/environment';

export class GoogleAuthController {
  /**
   * Generate Google OAuth URL with PKCE for mobile apps
   */
  async generateAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const { authUrl, codeVerifier } = googleOAuthService.generateAuthUrl();

      res.json({
        authUrl,
        codeVerifier,
      });
    } catch (error) {
      console.error('Generate auth URL error:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to generate auth URL');
      res.status(apiError.statusCode).json({ error: apiError.message });
    }
  }

  /**
   * Exchange authorization code for tokens (used by mobile apps)
   */
  async exchangeCodeForTokens(req: Request, res: Response): Promise<void> {
    try {
      const { code, codeVerifier } = req.body;

      if (!code || !codeVerifier) {
        throw new ApiError(400, 'Authorization code and code verifier are required');
      }

      const authResult = await googleOAuthService.authenticateUser(code, codeVerifier);

      res.json({
        token: authResult.token,
        user: authResult.user,
      });
    } catch (error) {
      console.error('Exchange code for tokens error:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to exchange code for tokens');
      res.status(apiError.statusCode).json({ error: apiError.message });
    }
  }

  /**
   * Handle Google OAuth callback (used by web apps)
   */
  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state, error } = req.query;

      console.log('Google OAuth callback received:', {
        hasCode: !!code,
        hasState: !!state,
        hasError: !!error,
        query: req.query,
      });

      // Handle OAuth errors from Google
      if (error) {
        console.error('Google OAuth error in callback:', error);
        return res.redirect(`${env.FRONTEND_URL}/auth/error?error=${encodeURIComponent(error as string)}`);
      }

      // Validate required parameters
      if (!code || typeof code !== 'string') {
        console.error('Missing or invalid authorization code');
        return res.redirect(`${env.FRONTEND_URL}/auth/error?error=missing_code`);
      }

      // Use legacy callback method (without PKCE for web redirects)
      const authResult = await googleOAuthService.handleLegacyCallback(code);

      console.log('Google OAuth callback successful:', {
        userId: authResult.user.id,
        userEmail: authResult.user.email,
      });

      // Redirect to frontend with token
      const redirectUrl = `${env.FRONTEND_URL}/auth/success?token=${authResult.token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);

      // Extract error message for logging
      const errorMessage = error instanceof ApiError ? error.message : 'Authentication failed';
      const errorStatus = error instanceof ApiError ? error.statusCode : 500;

      console.error('Callback error details:', {
        message: errorMessage,
        status: errorStatus,
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });

      // Redirect to frontend with error
      const redirectUrl = `${env.FRONTEND_URL}/auth/error?error=${encodeURIComponent(errorMessage)}`;
      res.redirect(redirectUrl);
    }
  }

  /**
   * Initiate Google OAuth flow (for web apps)
   */
  async initiateAuth(req: Request, res: Response): Promise<void> {
    try {
      const { authUrl } = googleOAuthService.generateAuthUrl();

      console.log('Initiating Google OAuth flow:', {
        authUrl: authUrl.substring(0, 100) + '...',
      });

      // Redirect to Google OAuth
      res.redirect(authUrl);
    } catch (error) {
      console.error('Initiate auth error:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to initiate authentication');
      res.status(apiError.statusCode).json({ error: apiError.message });
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      service: 'Google OAuth Service',
      timestamp: new Date().toISOString(),
      configuration: {
        hasClientId: !!env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${env.BACKEND_BASE_URL}/api/auth/google/callback`,
        backendBaseUrl: env.BACKEND_BASE_URL,
        frontendBaseUrl: env.FRONTEND_URL,
      },
    });
  }
}

export const googleAuthController = new GoogleAuthController();

// Bind methods to preserve 'this' context
googleAuthController.generateAuthUrl = googleAuthController.generateAuthUrl.bind(googleAuthController);
googleAuthController.exchangeCodeForTokens = googleAuthController.exchangeCodeForTokens.bind(googleAuthController);
googleAuthController.handleCallback = googleAuthController.handleCallback.bind(googleAuthController);
googleAuthController.initiateAuth = googleAuthController.initiateAuth.bind(googleAuthController);
googleAuthController.healthCheck = googleAuthController.healthCheck.bind(googleAuthController); 