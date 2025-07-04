import { Request, Response } from 'express';
import { asyncHandler, formatSuccessResponse } from '../utils/errors';
import { googleOAuthService } from '../services/googleOAuthService';

/**
 * @desc    Get Google OAuth authorization URL with PKCE
 * @route   GET /api/auth/google/url
 * @access  Public
 */
export const getGoogleAuthUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { authUrl, codeVerifier } = googleOAuthService.generateAuthUrl();

    res.status(200).json(formatSuccessResponse({
      authUrl,
      codeVerifier
    }, 'Google OAuth URL generated successfully'));
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Google OAuth URL'
    });
  }
});

/**
 * @desc    Exchange Google authorization code for tokens (PKCE flow)
 * @route   POST /api/auth/google/token
 * @access  Public
 */
export const exchangeGoogleCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { code, codeVerifier } = req.body;

  if (!code || !codeVerifier) {
    res.status(400).json({
      success: false,
      message: 'Authorization code and code verifier are required'
    });
    return;
  }

  try {
    const result = await googleOAuthService.authenticateUser(code, codeVerifier);

    res.status(200).json(formatSuccessResponse(result, 'Google authentication successful'));
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Google authentication failed'
    });
  }
}); 