import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IAuthRequest, IJWTPayload, IAppError } from '../types';
import { env } from '../config/environment';
import type { Secret, SignOptions } from 'jsonwebtoken';

// Custom error class
class AppError extends Error implements IAppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Verify JWT token
export const verifyToken = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as IJWTPayload;

    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token.', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired.', 401));
    } else {
      next(error);
    }
  }
};

// Optional authentication (doesn't throw error if no token)
export const optionalAuth = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as IJWTPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Don't throw error, just continue without user
    next();
  }
};

// Check if user is authenticated
export const requireAuth = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Authentication required.', 401));
    return;
  }
  next();
};

// Check if user owns the resource
export const requireOwnership = (resourceUserId: string) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required.', 401));
      return;
    }

    if (req.user._id !== resourceUserId) {
      next(new AppError('Access denied. You can only access your own resources.', 403));
      return;
    }

    next();
  };
};

// Generate JWT token
export const generateToken = (payload: IJWTPayload): string => {
  const options: SignOptions = { expiresIn: String(env.JWT_EXPIRES_IN) as import('jsonwebtoken').SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

// Generate refresh token
export const generateRefreshToken = (payload: IJWTPayload): string => {
  const options: SignOptions = { expiresIn: String(env.JWT_REFRESH_EXPIRES_IN) as import('jsonwebtoken').SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}; 