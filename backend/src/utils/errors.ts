import { Request } from 'express';

// Error types
export enum ErrorType {
  VALIDATION = 'ValidationError',
  AUTHENTICATION = 'AuthenticationError',
  AUTHORIZATION = 'AuthorizationError',
  NOT_FOUND = 'NotFoundError',
  CONFLICT = 'ConflictError',
  INTERNAL = 'InternalServerError',
  BAD_REQUEST = 'BadRequestError'
}

// Base API Error class
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    statusCode: number,
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, ErrorType.VALIDATION, details);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(401, message, ErrorType.AUTHENTICATION);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(403, message, ErrorType.AUTHORIZATION);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message, ErrorType.NOT_FOUND);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(409, message, ErrorType.CONFLICT);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request') {
    super(400, message, ErrorType.BAD_REQUEST);
  }
}

// Error response formatter
export const formatErrorResponse = (error: ApiError) => {
  const response: any = {
    success: false,
    error: {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode
    }
  };

  // Add details if available
  if (error.details) {
    response.error.details = error.details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  return response;
};

// Error handler
export const handleError = (error: any): ApiError => {
  // If it's already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));
    return new ValidationError('Validation failed', details);
  }

  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new ConflictError(`${field} already exists`);
  }

  // Handle Mongoose cast errors
  if (error.name === 'CastError') {
    return new BadRequestError(`Invalid ${error.path}: ${error.value}`);
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }

  // Handle MongoDB connection errors
  if (error.name === 'MongoNetworkError') {
    return new ApiError(503, 'Database connection failed', ErrorType.INTERNAL);
  }

  // Default internal server error
  return new ApiError(500, 'Internal server error', ErrorType.INTERNAL);
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error logger
export const logError = (error: any, req: Request): void => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', JSON.stringify(errorLog, null, 2));
  } else {
    // In production, you might want to log to a file or external service
    console.error('🚨 Error:', errorLog.error.message);
  }
};

// Success response formatter
export const formatSuccessResponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

// Pagination helper
export const formatPaginatedResponse = (
  data: any[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully'
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  };
}; 