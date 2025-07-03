import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { oauthService } from '../services/oauthService';
import { asyncHandler, formatSuccessResponse } from '../utils/errors';
import { env } from '../config/environment';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const result = await authService.loginWithEmail({ email, password });

  res.status(200).json(formatSuccessResponse(result, 'Login successful'));
});

/**
 * @desc    Register a new user
 * @route   POST /api/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  const result = await authService.registerUser({ name, email, password });

  res.status(201).json(formatSuccessResponse(result, 'User registered successfully'));
});

/**
 * @desc    Request password reset
 * @route   POST /api/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new Error('Email is required');
  }

  await authService.requestPasswordReset(email);

  res.status(200).json(formatSuccessResponse(
    null,
    'If an account with this email exists, you will receive a password reset link.'
  ));
});

/**
 * @desc    Reset password with token
 * @route   POST /api/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }

  await authService.resetPassword(token, newPassword);

  res.status(200).json(formatSuccessResponse(null, 'Password reset successfully'));
});

/**
 * @desc    Get current user profile
 * @route   GET /api/me
 * @access  Private
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  const profile = await authService.getUserProfile(user._id.toString());

  res.status(200).json(formatSuccessResponse({ user: profile }, 'Profile retrieved successfully'));
});

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, picture, preferences } = req.body;
  const user = (req as any).user;

  const updatedProfile = await authService.updateUserProfile(user._id.toString(), {
    name,
    picture,
    preferences
  });

  res.status(200).json(formatSuccessResponse({ user: updatedProfile }, 'Profile updated successfully'));
});

/**
 * @desc    Authenticate user with Google (Direct ID Token method)
 * @route   POST /api/login/google
 * @access  Public
 * @note    For web/mobile apps, consider using the OAuth flow instead:
 *          1. GET /api/auth/google/url to get OAuth URL
 *          2. Redirect user to OAuth URL
 *          3. Google redirects back to /api/auth/google/callback
 *          4. Backend redirects to frontend with token and user data
 */
export const loginWithGoogle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { idToken, accessToken, user: googleUser } = req.body;

  // Provide more specific error messages
  if (!idToken && !googleUser) {
    throw new Error('Google ID token and user data are both required. This endpoint expects: { idToken: string, accessToken?: string, user: { id, email, name, photo } }');
  }

  if (!idToken) {
    throw new Error('Google ID token is required. This endpoint expects: { idToken: string, accessToken?: string, user: { id, email, name, photo } }');
  }

  if (!googleUser) {
    throw new Error('Google user data is required. This endpoint expects: { idToken: string, accessToken?: string, user: { id, email, name, photo } }');
  }

  // Validate user data structure
  if (!googleUser.id || !googleUser.email || !googleUser.name) {
    throw new Error('Google user data must include id, email, and name fields. Received: ' + JSON.stringify(googleUser));
  }

  const result = await authService.loginWithGoogle({ idToken, accessToken, user: googleUser });

  res.status(200).json(formatSuccessResponse(result, 'Google authentication successful'));
});

/**
 * @desc    Authenticate user with Facebook
 * @route   POST /api/login/facebook
 * @access  Public
 */
export const loginWithFacebook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { accessToken, user: facebookUser } = req.body;

  if (!accessToken || !facebookUser) {
    throw new Error('Facebook access token and user data are required');
  }

  const result = await authService.loginWithFacebook(accessToken, facebookUser);

  res.status(200).json(formatSuccessResponse(result, 'Facebook authentication successful'));
});

/**
 * @desc    Authenticate user with Discord (OAuth2 code exchange)
 * @route   POST /api/login/discord
 * @access  Public
 */
export const loginWithDiscord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    throw new Error('Authorization code and redirect URI are required');
  }

  const result = await authService.loginWithDiscord(code, redirectUri);

  res.status(200).json(formatSuccessResponse(result, 'Discord authentication successful'));
});

/**
 * @desc    Logout user
 * @route   POST /api/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json(formatSuccessResponse(null, 'Logout successful'));
});

/**
 * @desc    Revoke user access
 * @route   POST /api/revoke
 * @access  Private
 */
export const revokeAccess = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    throw new Error('User ID is required');
  }

  res.status(200).json(formatSuccessResponse(null, 'Access revoked successfully'));
});

/**
 * @desc    Get OAuth authorization URL for Facebook
 * @route   GET /api/auth/facebook/url
 * @access  Public
 */
export const getFacebookAuthUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await oauthService.getFacebookAuthUrl();

  res.status(200).json(formatSuccessResponse(result, 'Facebook authorization URL generated'));
});

/**
 * @desc    Facebook OAuth callback
 * @route   GET /api/auth/facebook/callback
 * @access  Public
 */
export const facebookCallback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;

  if (!code) {
    throw new Error('Authorization code is required');
  }

  try {
    const result = await oauthService.handleFacebookCallback(code as string);
    const frontendUrl = oauthService.generateFrontendRedirect(result);
    res.redirect(frontendUrl);
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    const errorUrl = oauthService.generateErrorRedirect('facebook_auth_failed');
    res.redirect(errorUrl);
  }
});

/**
 * @desc    Get OAuth authorization URL for Discord
 * @route   GET /api/auth/discord/url
 * @access  Public
 */
export const getDiscordAuthUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { redirectUri, state } = req.query as { redirectUri?: string; state?: string };

    if (!redirectUri) {
      res.status(400).json({
        success: false,
        message: 'Redirect URI is required',
      });
      return;
    }

    const authUrl = authService.generateDiscordAuthUrl(redirectUri, state);

    res.status(200).json({
      success: true,
      message: 'Discord authorization URL generated successfully',
      data: {
        authUrl,
        clientId: env.DISCORD_CLIENT_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Discord OAuth callback
 * @route   GET /api/auth/discord/callback
 * @access  Public
 */
export const discordCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, state } = req.query as { code?: string; state?: string };

    if (!code) {
      console.error('Discord callback missing authorization code');
      const errorUrl = oauthService.generateErrorRedirect('discord_auth_failed');
      res.redirect(errorUrl);
      return;
    }

    try {
      const result = await oauthService.handleDiscordCallback(code);
      const frontendUrl = oauthService.generateFrontendRedirect(result);
      res.redirect(frontendUrl);
    } catch (error) {
      console.error('Discord OAuth callback error:', error);
      const errorUrl = oauthService.generateErrorRedirect('discord_auth_failed');
      res.redirect(errorUrl);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Google OAuth authorization URL
 * @route   GET /api/auth/google/url
 * @access  Public
 */
export const getGoogleAuthUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const authUrl = oauthService.generateGoogleOAuthUrl();

    res.json({
      success: true,
      data: {
        authUrl
      }
    });
  } catch (error) {
    console.error('Google OAuth URL generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Google OAuth URL'
    });
  }
});

/**
 * @desc    Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const handleGoogleCallback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      console.error('Google OAuth callback: Missing authorization code');
      const errorUrl = oauthService.generateErrorRedirect('missing_code');
      return res.redirect(errorUrl);
    }

    const result = await oauthService.handleGoogleCallback(code);

    // Redirect to frontend with token and user data
    const frontendUrl = oauthService.generateFrontendRedirect(result);
    res.redirect(frontendUrl);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const errorUrl = oauthService.generateErrorRedirect('google_auth_failed');
    res.redirect(errorUrl);
  }
}); 