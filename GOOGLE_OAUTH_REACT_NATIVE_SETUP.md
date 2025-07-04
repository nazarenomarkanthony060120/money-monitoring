# Google OAuth Setup for React Native (Expo)

## 🎯 **The Issue You Had**

Your React Native app was failing because of **redirect URI mismatches** and **response format issues**. Here's what was wrong and how we fixed it:

### ❌ **Problems:**

1. **Redirect URI mismatch**: Backend used web callback, mobile needed custom scheme
2. **Response format**: Frontend expected `{ success: true, data: {...} }`, backend returned direct objects
3. **Missing mobile redirect URI**: Token exchange didn't include the mobile redirect URI

### ✅ **Solutions:**

1. **Updated backend** to accept mobile redirect URIs
2. **Fixed response formats** to match frontend expectations
3. **Updated frontend** to pass correct redirect URIs

## 🔧 **Google Cloud Console Setup**

### Step 1: OAuth 2.0 Client ID Configuration

1. **Go to Google Cloud Console**
2. **Navigate to:** APIs & Services → Credentials
3. **Find your OAuth 2.0 Client ID**
4. **Add these redirect URIs:**

```
# For production (Expo app)
exp://your-app-name.com/oauth/callback

# For development (Expo Go)
exp://localhost:19000/oauth/callback

# For standalone app builds
moneymonitoring://oauth/callback

# For web callback (if needed)
https://money-monitoring.onrender.com/api/auth/google/callback
```

### Step 2: Configure Your App Scheme

In your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "scheme": "moneymonitoring",
    "name": "Money Monitoring",
    "slug": "money-monitoring"
  }
}
```

### Step 3: Environment Variables

**Frontend (.env):**

```bash
EXPO_PUBLIC_BACKEND_URL=https://money-monitoring.onrender.com
EXPO_PUBLIC_SCHEME=moneymonitoring
```

**Backend (.env):**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_BASE_URL=https://money-monitoring.onrender.com
FRONTEND_URL=https://your-frontend-url.com
```

## 🧪 **Testing Your Setup**

### Test 1: Check Backend Health

```bash
curl https://money-monitoring.onrender.com/api/auth/google/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "service": "Google OAuth Service",
  "configuration": {
    "hasClientId": true,
    "hasClientSecret": true,
    "redirectUri": "https://money-monitoring.onrender.com/api/auth/google/callback",
    "backendBaseUrl": "https://money-monitoring.onrender.com",
    "frontendBaseUrl": "https://your-frontend-url.com"
  }
}
```

### Test 2: Generate OAuth URL with Mobile Redirect

```bash
curl "https://money-monitoring.onrender.com/api/auth/google/url?redirectUri=moneymonitoring://oauth/callback"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
    "codeVerifier": "..."
  }
}
```

### Test 3: Mobile App Flow

1. **Open your app**
2. **Tap "Continue with Google"**
3. **Check console logs**:
   ```
   Mobile redirect URI: moneymonitoring://oauth/callback
   Authorization code received: { code: "...", state: "...", redirectUri: "..." }
   ```

## 🔍 **How the Fixed Flow Works**

### **Step 1: Generate OAuth URL**

- Frontend calls: `GET /api/auth/google/url?redirectUri=moneymonitoring://oauth/callback`
- Backend returns: `{ success: true, data: { authUrl, codeVerifier } }`

### **Step 2: User Authorization**

- Frontend opens OAuth URL in browser
- User authorizes app
- Google redirects to: `moneymonitoring://oauth/callback?code=...&state=...`

### **Step 3: Token Exchange**

- Frontend extracts code from callback URL
- Frontend calls: `POST /api/auth/google/token` with `{ code, codeVerifier, redirectUri }`
- Backend exchanges code for tokens using the same redirect URI
- Backend returns: `{ success: true, data: { token, user } }`

## 🚨 **Common Issues & Solutions**

### Issue 1: "redirect_uri_mismatch"

**Cause:** Google Cloud Console doesn't have the correct redirect URI

**Solution:**

1. Check your app scheme in `app.json`
2. Add `yourscheme://oauth/callback` to Google Cloud Console
3. Ensure no typos in the scheme name

### Issue 2: "Invalid response from server"

**Cause:** Response format mismatch between frontend and backend

**Solution:** ✅ **Fixed** - Backend now returns `{ success: true, data: {...} }`

### Issue 3: "Failed to exchange code for tokens"

**Cause:** Backend using different redirect URI than the one used for authorization

**Solution:** ✅ **Fixed** - Backend now uses the same redirect URI for token exchange

## 📱 **React Native Specific Notes**

### For Expo Go Development:

```javascript
// Development redirect URI
exp://localhost:19000/oauth/callback
```

### For Standalone App:

```javascript
// Production redirect URI
yourscheme://oauth/callback
```

### For EAS Build:

```javascript
// EAS Build redirect URI
exp://your-app-name.com/oauth/callback
```

## 🎯 **What's Different Now**

### ✅ **Backend Changes:**

- Accepts mobile redirect URIs
- Returns consistent response format
- Uses correct redirect URI for token exchange
- Enhanced logging for debugging

### ✅ **Frontend Changes:**

- Passes mobile redirect URI to backend
- Uses same redirect URI for authorization and token exchange
- Better error handling and logging

### ✅ **OAuth Flow:**

- Proper PKCE implementation
- Consistent redirect URI usage
- Mobile-optimized flow

## 🚀 **Deploy and Test**

1. **Deploy your backend** with the new changes
2. **Update your app** with the new frontend code
3. **Test the OAuth flow** end-to-end
4. **Check logs** for any remaining issues

Your Google OAuth should now work correctly with React Native (Expo)!
