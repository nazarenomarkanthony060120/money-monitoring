# Money Monitoring Backend API

A robust, scalable Node.js/Express.js backend API for money monitoring applications, built with TypeScript and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Registration, login, password reset, profile management
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Helmet.js, CORS, rate limiting, input sanitization
- **Database**: MongoDB with Mongoose ODM
- **TypeScript**: Full TypeScript support with strict typing
- **Logging**: Structured logging with Morgan
- **Environment Management**: Secure environment variable handling

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # MongoDB connection and configuration
│   └── environment.ts # Environment variables and validation
├── controllers/      # Route controllers
│   └── authController.ts # Authentication logic
├── middleware/       # Custom middleware
│   ├── auth.ts       # JWT authentication middleware
│   └── validation.ts # Request validation middleware
├── models/          # Mongoose models
│   ├── User.ts      # User model
│   ├── Transaction.ts # Transaction model
│   ├── Category.ts  # Category model
│   └── index.ts     # Model exports
├── routes/          # API routes
│   └── auth.ts      # Authentication routes
├── schemas/         # Mongoose schemas
│   ├── userSchema.ts # User schema definition
│   ├── transactionSchema.ts # Transaction schema
│   └── categorySchema.ts # Category schema
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   └── errors.ts    # Error handling utilities
├── validations/     # Request validation schemas
│   ├── userValidation.ts # User validation rules
│   ├── transactionValidation.ts # Transaction validation
│   └── categoryValidation.ts # Category validation
└── index.ts         # Application entry point
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd money-monitoring/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**

   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud)
   ```

5. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/money-monitoring

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
JWT_REFRESH_EXPIRES_IN=30d

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Security
BCRYPT_ROUNDS=12
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint                    | Description               | Access  |
| ------ | --------------------------- | ------------------------- | ------- |
| POST   | `/api/auth/register`        | Register new user         | Public  |
| POST   | `/api/auth/login`           | User login                | Public  |
| POST   | `/api/auth/forgot-password` | Request password reset    | Public  |
| POST   | `/api/auth/reset-password`  | Reset password with token | Public  |
| GET    | `/api/auth/me`              | Get user profile          | Private |
| PUT    | `/api/auth/profile`         | Update user profile       | Private |

### Health Check

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/api/health` | Application health status |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Request rate limiting to prevent abuse
- **Helmet.js**: Security headers for Express.js
- **Environment Validation**: Strict environment variable validation

## 🏗️ Code Quality

### Express.js Best Practices

- **Separation of Concerns**: Controllers, services, and models are separated
- **Middleware Pattern**: Custom middleware for authentication and validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Request Validation**: Input validation using express-validator
- **Response Formatting**: Consistent API response format

### TypeScript Best Practices

- **Strict Typing**: Full TypeScript support with strict mode
- **Interface Definitions**: Clear interfaces for all data structures
- **Type Safety**: Compile-time type checking
- **Generic Types**: Proper use of generics for reusability

### Node.js Best Practices

- **Async/Await**: Modern async/await pattern instead of callbacks
- **Error Handling**: Proper error handling with try-catch blocks
- **Environment Management**: Secure environment variable handling
- **Graceful Shutdown**: Proper application shutdown handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

The application includes built-in monitoring:

- **Health Check Endpoint**: `/api/health`
- **Database Status**: Connection monitoring
- **Error Logging**: Structured error logging
- **Request Logging**: HTTP request logging with Morgan

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@moneymonitoring.com or create an issue in the repository.
