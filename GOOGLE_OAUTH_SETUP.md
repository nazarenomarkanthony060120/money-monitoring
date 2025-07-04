# Google OAuth 2.0 with PKCE Setup Guide

This is a clean, focused implementation of Google OAuth 2.0 Sign-In using Authorization Code flow with PKCE for React Native Expo + Express.js TypeScript.

## 🏗️ Architecture

- **Backend**: Express.js + TypeScript
- **Frontend**: React Native + Expo
- **Flow**: Authorization Code with PKCE
- **Security**: ID token verification with Google's public keys

## 📁 Files Created

### Backend

- `backend/src/services/googleOAuthService.ts` - Google OAuth service with PKCE
- `backend/src/controllers/googleAuthController.ts` - Clean API endpoints

### Frontend

- `frontend/components/auth/GoogleSignInButton.tsx` - Google sign-in component
- `frontend/components/auth/LoginForm.tsx` - Updated login form
- `frontend/services/authService.ts` - Simple type definitions

## 🔧 Setup Instructions

### 1. Environment Variables

**Backend `.env`:**

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:19006
```

**Frontend `.env`:**

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:5000
EXPO_PUBLIC_SCHEME=moneymonitoring
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID (Web application)
3. Add redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `https://auth.expo.io/@your-username/your-app-slug`
   - `moneymonitoring://oauth/callback`

### 3. Test the Implementation

**Start Backend:**

```bash
cd backend
npm run dev
```

**Start Frontend:**

```bash
cd frontend
npm start
```

## 🔄 OAuth Flow

1. **User clicks "Continue with Google"**
2. **Frontend** → `GET /api/auth/google/url` → **Backend generates PKCE challenge**
3. **Browser opens** → Google OAuth consent screen
4. **User authorizes** → **Authorization code returned**
5. **Frontend** → `POST /api/auth/google/token` → **Backend exchanges code + verifier**
6. **Backend verifies ID token** → **Creates user session** → **Returns JWT**
7. **Frontend stores auth data** → **User logged in**

## 🛡️ Security Features

- ✅ **PKCE** - Prevents authorization code interception
- ✅ **ID Token Verification** - Uses Google's public keys
- ✅ **Secure Backend Exchange** - Client secrets never exposed
- ✅ **Error Handling** - Comprehensive error messages

## 🚀 API Endpoints

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| `GET`  | `/api/auth/google/url`   | Get OAuth URL + code verifier |
| `POST` | `/api/auth/google/token` | Exchange code for tokens      |

## 💻 Usage Example

```tsx
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";

const LoginScreen = () => {
  const handleSuccess = (result) => {
    console.log("User:", result.user);
    console.log("Token:", result.token);
    // Handle successful authentication
  };

  return (
    <GoogleSignInButton
      onSuccess={handleSuccess}
      onError={(error) => console.error(error)}
    />
  );
};
```

## 🧪 Testing

1. Open your Expo app
2. Click "Continue with Google"
3. Complete OAuth flow in browser
4. Verify successful authentication

## 🔍 Troubleshooting

- **"Invalid client ID"** → Check environment variables
- **"Redirect URI mismatch"** → Verify Google Console settings
- **"Network error"** → Ensure backend is running on correct port

This implementation is clean, secure, and production-ready! 🎉
