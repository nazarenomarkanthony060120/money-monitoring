# Money Monitoring App

A React Native Expo app for monitoring personal finances with authentication support for Google, Facebook, and Discord.

## Features

- 🔐 Multi-provider authentication (Google, Facebook, Discord)
- 💰 Transaction tracking and categorization
- 📊 Financial analytics and reports
- 🎨 Modern, responsive UI
- 🔒 Secure backend API with JWT authentication

## Project Structure

```
money-monitoring/
├── frontend/          # React Native Expo app
├── backend/           # Node.js Express API
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- MongoDB
- Google Cloud Console account (for Google Sign-In)

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Required environment variables:

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

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id

# Facebook OAuth Configuration
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

### 3. Start the Backend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```env
MONEY_MONITORING_BACKEND_BASE_API=http://localhost:5000
GOOGLE_SIGNIN_ANDROID_CLIENT_ID=your-android-client-id
GOOGLE_SIGNIN_IOS_CLIENT_ID=your-ios-client-id
GOOGLE_SIGNIN_WEB_CLIENT_ID=your-web-client-id
```

### 3. Google Sign-In Setup

#### Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs:
   - Android client ID (for Android app)
   - iOS client ID (for iOS app)
   - Web client ID (for web app)

#### Android Configuration

1. Download the `google-services.json` file from Google Cloud Console
2. Place it in the `frontend/` directory
3. Update the package name in `app.config.ts` to match your Google Cloud Console configuration

#### iOS Configuration

1. Download the `GoogleService-Info.plist` file from Google Cloud Console
2. Place it in the `frontend/ios/` directory
3. Update the bundle identifier in `app.config.ts` to match your Google Cloud Console configuration

### 4. Start the Frontend

```bash
# Start with Expo Go (limited functionality)
npx expo start

# Build and run on device/emulator (full functionality)
npx expo prebuild
npx expo run:android  # or npx expo run:ios
```

## Authentication Flow

### Google Sign-In

1. User taps "Sign in with Google" button
2. Google Sign-In SDK handles authentication
3. Frontend sends ID token and user data to backend
4. Backend verifies the ID token with Google
5. Backend creates or finds user in database
6. Backend returns JWT token for subsequent API calls

### Facebook/Discord Sign-In

1. User taps "Sign in with Facebook/Discord" button
2. Expo AuthSession handles OAuth flow
3. Frontend sends access token and user data to backend
4. Backend verifies the access token with provider's API
5. Backend creates or finds user in database
6. Backend returns JWT token for subsequent API calls

## API Endpoints

### Authentication

- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/facebook` - Facebook OAuth login
- `POST /api/auth/discord` - Discord OAuth login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/revoke` - Revoke user access
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

## Development Notes

### Important Limitations

- **Google Sign-In**: Requires a custom development build or full app build. Does not work with Expo Go.
- **Native Modules**: Some features require building the app with `npx expo prebuild` and running with `npx expo run:android` or `npx expo run:ios`.

### Testing Authentication

1. Build the app with `npx expo prebuild`
2. Run on device/emulator with `npx expo run:android` or `npx expo run:ios`
3. Test authentication flows
4. Check backend logs for authentication requests

### Troubleshooting

#### Google Sign-In Issues

- Ensure `google-services.json` is in the correct location
- Verify client IDs match between Google Cloud Console and app configuration
- Check that the package name/bundle identifier matches
- Ensure the app is built with native modules (not Expo Go)

#### Backend Connection Issues

- Verify the backend is running on the correct port
- Check CORS configuration in backend
- Ensure environment variables are properly set
- Check network connectivity between frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
