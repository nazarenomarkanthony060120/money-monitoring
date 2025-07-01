# Authentication Setup Guide

This project includes a complete authentication system with Google, Facebook, and Discord login using Expo AuthSession.

## Features

- ✅ Google OAuth Login
- ✅ Facebook OAuth Login
- ✅ Discord OAuth Login
- ✅ Zustand for state management
- ✅ TanStack React Query for data fetching
- ✅ NativeWind CSS for styling
- ✅ Persistent authentication state
- ✅ TypeScript support
- ✅ Clean and modern UI

## Setup Instructions

### 1. OAuth Provider Configuration

You need to set up OAuth applications for each provider and update the client IDs in `src/services/authService.ts`:

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://auth.expo.io/@your-username/frontend`
   - `frontend://auth/google`
7. Copy the Client ID and update `GOOGLE_CLIENT_ID` in the auth service

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `https://auth.expo.io/@your-username/frontend`
   - `frontend://auth/facebook`
5. Copy the App ID and update `FACEBOOK_CLIENT_ID` in the auth service

#### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URIs:
   - `https://auth.expo.io/@your-username/frontend`
   - `frontend://auth/discord`
5. Copy the Client ID and update `DISCORD_CLIENT_ID` in the auth service

### 2. Update Configuration

Replace the placeholder client IDs in `src/services/authService.ts`:

```typescript
const GOOGLE_CLIENT_ID = 'your-google-client-id'
const FACEBOOK_CLIENT_ID = 'your-facebook-client-id'
const DISCORD_CLIENT_ID = 'your-discord-client-id'
```

### 3. Backend Integration

The current implementation uses mock responses. To integrate with your backend:

1. Update the `exchangeCodeForToken` method in `src/services/authService.ts`
2. Send the authorization code to your backend
3. Backend should exchange the code for access tokens and user data
4. Return the user data and JWT token

### 4. Environment Variables

For production, move the client IDs to environment variables:

```typescript
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
const FACEBOOK_CLIENT_ID = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID
const DISCORD_CLIENT_ID = process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID
```

## Project Structure

```
src/
├── components/
│   └── auth/
│       └── LoginScreen.tsx      # Main login screen
├── hooks/
│   └── useAuth.ts              # Authentication hook
├── services/
│   └── authService.ts          # OAuth service
├── stores/
│   └── authStore.ts            # Zustand store
└── types/
    └── auth.ts                 # TypeScript types
```

## Usage

The authentication system automatically handles:

- OAuth flow with each provider
- Loading states and error handling
- Persistent authentication state
- Automatic navigation between auth and main app

Users can:

1. Choose their preferred login provider
2. Complete OAuth flow in browser
3. Return to app with authenticated session
4. View profile and logout from profile tab

## Testing

To test the authentication:

1. Run `npm start` or `expo start`
2. Navigate to the login screen
3. Select a provider (currently shows mock data)
4. Verify the profile screen shows user information
5. Test logout functionality

## Security Notes

- Never commit real client IDs to version control
- Use environment variables for production
- Implement proper token validation on backend
- Add proper error handling for failed authentication
- Consider implementing token refresh logic
