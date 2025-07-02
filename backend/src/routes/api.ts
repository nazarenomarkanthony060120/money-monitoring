import { Router } from 'express';
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
import {
  validateUserLogin,
  validateUserRegistration,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateUserProfileUpdate,
  validateDiscordAuth
} from '../validations/userValidation';
import { verifyToken } from '../middleware/auth';

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

// Google OAuth routes
router.get('/auth/google/url', getGoogleAuthUrl);
router.get('/auth/google/callback', handleGoogleCallback);

// Password management
router.post('/forgot-password', validatePasswordResetRequest, forgotPassword);
router.post('/reset-password', validatePasswordReset, resetPassword);

// User profile
router.get('/me', verifyToken, getProfile);
router.put('/profile', verifyToken, validateUserProfileUpdate, updateProfile);

export default router; 