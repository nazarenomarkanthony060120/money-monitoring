import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import apiRoutes from './routes/api';
import { handleError, formatErrorResponse, logError } from './utils/errors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { env } from './config/environment';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API root. Try /api/health',
  });
});

// 404 handler with Discord integration
app.use('*', notFoundHandler);

// Global error handler with Discord integration
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${env.PORT}/api/health`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${env.PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer(); 