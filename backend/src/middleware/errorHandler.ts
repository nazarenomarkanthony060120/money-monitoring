import { Request, Response, NextFunction } from 'express';
import { discordService, DiscordErrorPayload } from '../services/discordService';
import { env } from '../config/environment';

export interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: number;
}

/**
 * Global error handler middleware
 */
export const errorHandler = async (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Default error values
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Log error locally
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Prepare Discord error payload
  const errorPayload: DiscordErrorPayload = {
    error: err.name || 'UnknownError',
    message: message,
    stack: err.stack,
    endpoint: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    source: 'backend',
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
  };

  // Add user ID if available (from auth middleware)
  if ((req as any).user?.id) {
    errorPayload.userId = (req as any).user.id;
  }

  // Send error to Discord (only for production errors or 500+ status codes)
  if (env.NODE_ENV === 'production' || env.NODE_ENV === 'development' || statusCode >= 500) {
    try {
      await discordService.sendErrorToDiscord(errorPayload);
    } catch (discordError) {
      console.error('Failed to send error to Discord:', discordError);
    }
  }

  // Don't leak error details in production
  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found - ${req.originalUrl}`) as ErrorWithStatus;
  error.statusCode = 404;
  next(error);
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}; 