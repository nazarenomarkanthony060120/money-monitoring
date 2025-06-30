import { config } from 'dotenv';

// Load environment variables
config();

// Environment variable validation
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRES_IN',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'CORS_ORIGIN',
  'BCRYPT_ROUNDS'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Environment configuration interface
interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CORS_ORIGIN: string;
  BCRYPT_ROUNDS: string;
}

// Environment configuration object
export const env: EnvironmentConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID!,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET!,
  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASS: process.env.EMAIL_PASS!,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN!,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || '12'
};

// Environment validation
const validateEnvironment = (): void => {
  // Validate NODE_ENV
  if (!['development', 'production', 'test'].includes(env.NODE_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${env.NODE_ENV}. Must be development, production, or test`);
  }

  // Validate PORT
  if (env.PORT < 1 || env.PORT > 65535) {
    throw new Error(`Invalid PORT: ${env.PORT}. Must be between 1 and 65535`);
  }

  // Validate MongoDB URI
  if (!env.MONGODB_URI.startsWith('mongodb://') && !env.MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MONGODB_URI format');
  }

  // Validate JWT secrets
  if (env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  // Validate email configuration
  if (env.EMAIL_PORT < 1 || env.EMAIL_PORT > 65535) {
    throw new Error(`Invalid EMAIL_PORT: ${env.EMAIL_PORT}. Must be between 1 and 65535`);
  }

  // Validate rate limiting
  if (env.RATE_LIMIT_WINDOW_MS < 1000) {
    throw new Error('RATE_LIMIT_WINDOW_MS must be at least 1000ms');
  }

  if (env.RATE_LIMIT_MAX_REQUESTS < 1) {
    throw new Error('RATE_LIMIT_MAX_REQUESTS must be at least 1');
  }

  // Validate bcrypt rounds
  const bcryptRounds = parseInt(env.BCRYPT_ROUNDS);
  if (bcryptRounds < 10 || bcryptRounds > 14) {
    throw new Error('BCRYPT_ROUNDS must be between 10 and 14');
  }
};

// Validate environment on startup
try {
  validateEnvironment();
  console.log('✅ Environment configuration validated successfully');
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  process.exit(1);
}

// Export environment configuration
export default env; 