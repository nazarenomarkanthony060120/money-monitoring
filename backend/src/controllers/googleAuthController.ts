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
      // Check if this is a mobile request (accepts redirectUri parameter)
      const mobileRedirectUri = req.query.redirectUri as string;

      const { authUrl, codeVerifier } = googleOAuthService.generateAuthUrl(mobileRedirectUri);

      res.json({
        success: true,
        data: {
          authUrl,
          codeVerifier,
        },
      });
    } catch (error) {
      console.error('Generate auth URL error:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to generate auth URL');
      res.status(apiError.statusCode).json({
        success: false,
        error: apiError.message
      });
    }
  }

  /**
   * Exchange authorization code for tokens (used by mobile apps)
   */
  async exchangeCodeForTokens(req: Request, res: Response): Promise<void> {
    try {
      const { code, codeVerifier, redirectUri } = req.body;

      if (!code || !codeVerifier) {
        throw new ApiError(400, 'Authorization code and code verifier are required');
      }

      const authResult = await googleOAuthService.authenticateUser(code, codeVerifier, redirectUri);

      res.json({
        success: true,
        data: {
          token: authResult.token,
          user: authResult.user,
        },
      });
    } catch (error) {
      console.error('Exchange code for tokens error:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to exchange code for tokens');
      res.status(apiError.statusCode).json({
        success: false,
        error: apiError.message
      });
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

      if (!state || typeof state !== 'string') {
        console.error('Missing or invalid state parameter');
        return res.redirect(`${env.FRONTEND_URL}/auth/error?error=missing_state`);
      }

      // Use new web callback method with PKCE (retrieves stored code verifier)
      const authResult = await googleOAuthService.handleWebCallback(code, state);

      console.log('Google OAuth callback successful:', {
        userId: authResult.user.id,
        userEmail: authResult.user.email,
        isMobileRedirect: authResult.isMobileRedirect,
        originalRedirectUri: authResult.redirectUri,
      });

      // Check if this was a mobile redirect (deep link) or web redirect
      if (authResult.isMobileRedirect && authResult.redirectUri) {
        // For mobile redirects, redirect to the mobile app with token and user info
        const userInfo = encodeURIComponent(JSON.stringify({
          id: authResult.user.id,
          name: authResult.user.name,
          email: authResult.user.email,
          picture: authResult.user.picture,
          provider: authResult.user.provider,
          isEmailVerified: authResult.user.isEmailVerified,
        }));

        const mobileRedirectUrl = `${authResult.redirectUri}?token=${authResult.token}&success=true&user=${userInfo}`;
        console.log('Redirecting to mobile app:', {
          redirectUri: authResult.redirectUri,
          hasToken: !!authResult.token,
          userId: authResult.user.id,
          userEmail: authResult.user.email,
        });
        res.redirect(mobileRedirectUrl);
      } else {
        // For web redirects, redirect to frontend web URL
        const redirectUrl = `${env.FRONTEND_URL}/auth/success?token=${authResult.token}`;
        console.log('Redirecting to web frontend:', redirectUrl);
        res.redirect(redirectUrl);
      }
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

  /**
 * Debug endpoint to check PKCE sessions
 */
  async debugPKCESessions(req: Request, res: Response): Promise<void> {
    try {
      const debugInfo = googleOAuthService.getPKCEStoreDebugInfo();

      res.json({
        status: 'ok',
        pkceStoreSize: debugInfo.size,
        activeSessions: debugInfo.sessions.length,
        sessions: debugInfo.sessions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Debug PKCE sessions error:', error);
      res.status(500).json({ error: 'Failed to get PKCE sessions debug info' });
    }
  }
}

export const googleAuthController = new GoogleAuthController();

// Bind methods to preserve 'this' context
googleAuthController.generateAuthUrl = googleAuthController.generateAuthUrl.bind(googleAuthController);
googleAuthController.exchangeCodeForTokens = googleAuthController.exchangeCodeForTokens.bind(googleAuthController);
googleAuthController.handleCallback = googleAuthController.handleCallback.bind(googleAuthController);
googleAuthController.initiateAuth = googleAuthController.initiateAuth.bind(googleAuthController);
googleAuthController.healthCheck = googleAuthController.healthCheck.bind(googleAuthController);
googleAuthController.debugPKCESessions = googleAuthController.debugPKCESessions.bind(googleAuthController); 