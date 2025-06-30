import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { ApiError, asyncHandler, formatSuccessResponse } from '../utils/errors';
import { env } from '../config/environment';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Find user by email and provider
  const user = await User.findOne({
    email: email.toLowerCase(),
    provider: 'email'
  }).select('+password') as any;

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    provider: user.provider
  });

  // Send response
  res.status(200).json(formatSuccessResponse({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  }, 'Login successful'));
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
    provider: 'email'
  });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  // Hash password
  const saltRounds = parseInt(env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    provider: 'email',
    isEmailVerified: false,
  }) as any;

  // Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    provider: user.provider
  });

  // Send response
  res.status(201).json(formatSuccessResponse({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  }, 'User registered successfully'));
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  // Find user by email
  const user = await User.findOne({
    email: email.toLowerCase(),
    provider: 'email'
  }) as any;

  if (!user) {
    // For security, don't reveal if user exists
    res.status(200).json(formatSuccessResponse(
      null,
      'If an account with this email exists, you will receive a password reset link.'
    ));
    return;
  }

  // Generate password reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // TODO: Send email with reset token
  // This would typically involve an email service like SendGrid, AWS SES, etc.
  console.log('Password reset token:', resetToken);

  res.status(200).json(formatSuccessResponse(
    null,
    'If an account with this email exists, you will receive a password reset link.'
  ));
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  // Validate required fields
  if (!token || !newPassword) {
    throw new ApiError(400, 'Token and new password are required');
  }

  // Find user by reset token using static method
  const user = await User.findByPasswordResetToken(token) as any;

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Hash new password
  const saltRounds = parseInt(env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password and clear reset token
  user.password = hashedPassword;
  user.clearPasswordResetToken();
  await user.save();

  res.status(200).json(formatSuccessResponse(null, 'Password reset successfully'));
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // User is attached to req by auth middleware
  const user = (req as any).user;

  res.status(200).json(formatSuccessResponse({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
      createdAt: user.createdAt,
    }
  }, 'Profile retrieved successfully'));
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, picture, preferences } = req.body;
  const user = (req as any).user;

  // Update allowed fields
  if (name) user.name = name.trim();
  if (picture) user.picture = picture;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  await user.save();

  res.status(200).json(formatSuccessResponse({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
    }
  }, 'Profile updated successfully'));
}); 