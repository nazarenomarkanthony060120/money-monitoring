import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
} from '../controllers/authController';
import {
  validateUserLogin,
  validateUserRegistration,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateUserProfileUpdate
} from '../validations/userValidation';
import { verifyToken } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validateUserLogin, login);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateUserRegistration, register);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validatePasswordResetRequest, forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', validatePasswordReset, resetPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyToken, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', verifyToken, validateUserProfileUpdate, updateProfile);

export default router; 