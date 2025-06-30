import mongoose from 'mongoose';
import { env } from './environment';

// MongoDB connection options
const mongoOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: 'majority' as any
};

// Connection event handlers
const handleConnectionEvents = (): void => {
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
};

// Connect to MongoDB
export const connectDatabase = async (): Promise<void> => {
  try {
    // Set up connection event handlers
    handleConnectionEvents();

    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI, mongoOptions);

    // Set mongoose options
    mongoose.set('debug', env.NODE_ENV === 'development');
    mongoose.set('strictQuery', false);

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Disconnect from MongoDB
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
};

// Get database status
export const getDatabaseStatus = () => {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

// Check if database is connected
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
}; 