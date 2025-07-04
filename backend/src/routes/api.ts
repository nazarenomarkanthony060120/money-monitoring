import { Router, Request, Response } from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  loginWithGoogle,
  loginWithDiscord,
  loginWithFacebook,
  logout,
  revokeAccess,
  getFacebookAuthUrl,
  facebookCallback,
  getDiscordAuthUrl,
  discordCallback,
  getGoogleAuthUrl,
  handleGoogleCallback
} from '../controllers/authController';
import { googleAuthController } from '../controllers/googleAuthController';
import {
  validateUserLogin,
  validateUserRegistration,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateUserProfileUpdate,
  validateDiscordAuth
} from '../validations/userValidation';
import { verifyToken } from '../middleware/auth';
import { discordService } from '../services/discordService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Authentication routes
router.post('/login', validateUserLogin, login);
router.post('/login/google', loginWithGoogle);
router.post('/login/facebook', loginWithFacebook);
router.post('/login/discord', validateDiscordAuth, loginWithDiscord);
router.post('/register', validateUserRegistration, register);
router.post('/logout', verifyToken, logout);
router.post('/revoke', verifyToken, revokeAccess);

// OAuth URL generation routes
router.get('/auth/facebook/url', getFacebookAuthUrl);
router.get('/auth/discord/url', getDiscordAuthUrl);

// OAuth callback routes
router.get('/auth/facebook/callback', facebookCallback);
router.get('/auth/discord/callback', discordCallback);

// Google OAuth routes (PKCE implementation)
router.get('/auth/google/url', googleAuthController.generateAuthUrl);
router.post('/auth/google/token', googleAuthController.exchangeCodeForTokens);
router.get('/auth/google/callback', googleAuthController.handleCallback);
router.get('/auth/google/initiate', googleAuthController.initiateAuth);
router.get('/auth/google/health', googleAuthController.healthCheck);
router.get('/auth/google/debug', googleAuthController.debugPKCESessions);

// Password management
router.post('/forgot-password', validatePasswordResetRequest, forgotPassword);
router.post('/reset-password', validatePasswordReset, resetPassword);

// User profile
router.get('/me', verifyToken, getProfile);
router.put('/profile', verifyToken, validateUserProfileUpdate, updateProfile);

// Error reporting to Discord
router.post('/error/discord', asyncHandler(async (req: Request, res: Response) => {
  const frontendError = req.body;

  // Convert frontend error to Discord error payload
  const discordPayload = {
    error: frontendError.error || 'Frontend Error',
    message: frontendError.message || 'No message provided',
    stack: frontendError.stack,
    userId: frontendError.userId,
    endpoint: frontendError.page || frontendError.url,
    method: 'Frontend',
    timestamp: frontendError.timestamp || new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    source: 'frontend' as const,
    userAgent: frontendError.userAgent,
    ip: req.ip || req.connection.remoteAddress,
  };

  await discordService.sendErrorToDiscord(discordPayload);

  res.status(200).json({
    success: true,
    message: 'Error reported to Discord successfully',
  });
}));

// Test Discord webhook
router.post('/test/discord', asyncHandler(async (req: Request, res: Response) => {
  const testPayload = {
    error: 'Test Error',
    message: 'This is a test error to verify Discord webhook integration',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    source: 'backend' as const,
    endpoint: '/api/test/discord',
    method: 'POST',
  };

  await discordService.sendErrorToDiscord(testPayload);

  res.status(200).json({
    success: true,
    message: 'Test error sent to Discord successfully',
  });
}));

export default router; 