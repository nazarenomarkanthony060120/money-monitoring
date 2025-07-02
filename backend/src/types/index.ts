import { Request } from 'express';
import { Model } from 'mongoose';

// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  provider: 'email' | 'google' | 'facebook' | 'discord';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  preferences?: {
    currency: string;
    timezone: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  clearPasswordResetToken(): void;
  generateEmailVerificationToken(): string;
  clearEmailVerificationToken(): void;
  verifyEmailToken(token: string): boolean;
  verifyPasswordResetToken(token: string): boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmailAndProvider(email: string, provider: string): Promise<IUserDocument | null>;
  findByEmailVerificationToken(token: string): Promise<IUserDocument | null>;
  findByPasswordResetToken(token: string): Promise<IUserDocument | null>;
  findOrCreateOAuthUser(profile: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: 'google' | 'facebook' | 'discord';
  }): Promise<IUserDocument>;
}

// Transaction Types
export interface ITransaction {
  _id: string;
  user: string; // ObjectId reference to User
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string; // ObjectId reference to Category
  description: string;
  date: Date;
  tags?: string[];
  location?: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other';
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  attachments?: Array<{
    filename: string;
    url: string;
    mimetype: string;
    size: number;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {
  duplicate(): Promise<ITransactionDocument>;
}

export interface ITransactionModel extends Model<ITransactionDocument> {
  findByUser(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      type?: 'income' | 'expense';
      category?: string;
      startDate?: Date;
      endDate?: Date;
      tags?: string[];
      paymentMethod?: string;
    }
  ): Promise<ITransactionDocument[]>;
  getUserStats(userId: string, period: { startDate: Date; endDate: Date }): Promise<{
    income: { total: number; count: number };
    expense: { total: number; count: number };
  }>;
  getCategoryStats(
    userId: string,
    type: 'income' | 'expense',
    period: { startDate: Date; endDate: Date }
  ): Promise<Array<{
    category: { _id: string; name: string; icon: string; color: string };
    total: number;
    count: number;
  }>>;
}

// Category Types
export interface ICategory {
  _id: string;
  user: string; // ObjectId reference to User
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
  isActive: boolean;
  parentCategory?: string; // ObjectId reference to Category
  description?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  getStats(period?: { startDate: Date; endDate: Date }): Promise<{
    income: { total: number; count: number };
    expense: { total: number; count: number };
  }>;
}

export interface ICategoryModel extends Model<ICategoryDocument> {
  findByUser(
    userId: string,
    options?: {
      type?: 'income' | 'expense' | 'both';
      isActive?: boolean;
      includeSubcategories?: boolean;
    }
  ): Promise<ICategoryDocument[]>;
  getDefaultCategories(): Promise<ICategoryDocument[]>;
  createDefaultCategories(userId: string): Promise<ICategoryDocument[]>;
}

// Budget Types
export interface IBudget {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  categories: string[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudgetDocument extends IBudget, Document { }

// Authentication Types
export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface IGoogleAuthRequest {
  idToken: string;
}

export interface IFacebookAuthRequest {
  accessToken: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
}

// JWT Types
export interface IJWTPayload {
  userId: string;
  email: string;
  provider: string;
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Validation Types
export interface IValidationError {
  field: string;
  message: string;
}

// Email Types
export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// OAuth Types
export interface IGoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface IFacebookUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

// Statistics Types
export interface ITransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface ICategoryStats {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface IMonthlyStats {
  month: string;
  income: number;
  expense: number;
  netAmount: number;
}

// Error Types
export interface IAppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Environment Types
export interface IEnvironment {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  MONGODB_URI_PROD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  GOOGLE_CLIENT_ID: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CORS_ORIGIN: string;
  BCRYPT_ROUNDS: number;
} 