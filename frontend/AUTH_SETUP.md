# Authentication Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your Money Monitor app.

## Prerequisites

- Expo CLI installed
- Google Cloud Console account
- Facebook Developer account
- Backend API endpoint for email/password authentication

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Money Monitor"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - For development: `https://auth.expo.io/@your-expo-username/money-monitoring`
   - For production: `https://your-domain.com/auth`
5. Copy the Client ID

### 4. Update Configuration

In `services/authService.ts`, replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:

```typescript
const GOOGLE_CLIENT_ID = "your-google-client-id-here";
```

## Facebook OAuth Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details and create the app

### 2. Configure Facebook Login

1. In your app dashboard, go to "Add Product" > "Facebook Login"
2. Choose "Web" platform
3. Add your domain to "Valid OAuth Redirect URIs":
   - For development: `https://auth.expo.io/@your-expo-username/money-monitoring`
   - For production: `https://your-domain.com/auth`
4. Copy the App ID

### 3. Update Configuration

In `services/authService.ts`, replace `YOUR_FACEBOOK_APP_ID` with your actual Facebook App ID:

```typescript
const FACEBOOK_APP_ID = "your-facebook-app-id-here";
```

## Backend API Setup

### 1. Email/Password Authentication

Update the API endpoints in `services/authService.ts`:

```typescript
// Replace with your actual API endpoints
const API_BASE_URL = "https://your-api-domain.com/api";

// In signInWithEmail method:
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  // ... rest of the code
});

// In signUpWithEmail method:
const response = await fetch(`${API_BASE_URL}/auth/register`, {
  // ... rest of the code
});

// In forgotPassword method:
const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
  // ... rest of the code
});
```

### 2. Backend Requirements

Your backend should implement these endpoints:

- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - Email/password registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/verify-token` - Token verification (optional)

## Expo Configuration

### 1. Update app.json

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "money-monitoring",
    "android": {
      "package": "com.yourcompany.moneymonitoring"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.moneymonitoring"
    }
  }
}
```

### 2. Configure Deep Links

For production, you'll need to configure deep links in your hosting platform.

## Testing

### 1. Test Google OAuth

1. Run your app: `expo start`
2. Navigate to the login screen
3. Tap "Continue with Google"
4. Complete the OAuth flow

### 2. Test Facebook OAuth

1. Run your app: `expo start`
2. Navigate to the login screen
3. Tap "Continue with Facebook"
4. Complete the OAuth flow

### 3. Test Email/Password

1. Create a test account using the signup screen
2. Try logging in with the created credentials
3. Test the forgot password functionality

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in your OAuth configuration matches exactly
   - Check that you're using the correct Expo username

2. **"App not configured" error (Facebook)**
   - Ensure your Facebook app is in "Live" mode or add test users
   - Verify the App ID is correct

3. **"Invalid client" error (Google)**
   - Check that the Client ID is correct
   - Ensure the OAuth consent screen is properly configured

4. **Deep link not working**
   - Verify the scheme in app.json matches your configuration
   - Test with `expo start --tunnel` for better deep link support

### Debug Mode

Enable debug logging by adding this to your auth service:

```typescript
// Add to the top of authService.ts
const DEBUG = true;

// Add debug logs throughout the authentication methods
if (DEBUG) {
  console.log("Auth debug:", { method, params });
}
```

## Security Considerations

1. **Never commit API keys to version control**
   - Use environment variables for sensitive data
   - Consider using Expo's secure store for local storage

2. **Implement proper token validation**
   - Verify tokens on your backend
   - Implement token refresh logic

3. **Handle user data securely**
   - Encrypt sensitive user data
   - Follow GDPR and other privacy regulations

4. **Implement proper error handling**
   - Don't expose sensitive information in error messages
   - Log errors securely

## Production Deployment

1. **Update OAuth configurations**
   - Add production redirect URIs
   - Update app settings for production

2. **Configure environment variables**
   - Set up proper environment management
   - Use different keys for development and production

3. **Test thoroughly**
   - Test all authentication flows
   - Verify error handling
   - Test on both iOS and Android

## Support

If you encounter issues:

1. Check the [Expo AuthSession documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
2. Review [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
3. Review [Facebook Login documentation](https://developers.facebook.com/docs/facebook-login/)
4. Check the Expo forums and GitHub issues
