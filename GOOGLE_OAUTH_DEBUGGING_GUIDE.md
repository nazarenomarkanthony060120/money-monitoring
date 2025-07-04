# Google OAuth Debugging Guide

## 🐛 Common Issues and Solutions

Based on your error, here are the most likely causes and solutions:

### 1. **Redirect URI Mismatch** (Most Common)

**Issue:** The redirect URI in your token exchange request doesn't exactly match Google Cloud Console.

**Solution:**

- In Google Cloud Console, make sure you have **exactly** this URI:
  ```
  https://money-monitoring.onrender.com/api/auth/google/callback
  ```
- No trailing slash, exact protocol (https), exact domain

### 2. **Environment Variables Issues**

**Issue:** Your production environment doesn't have the correct Google OAuth credentials.

**Check your environment variables:**

```bash
# In your Render.com dashboard or server, verify these are set:
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
BACKEND_BASE_URL=https://money-monitoring.onrender.com
FRONTEND_URL=https://your-frontend-url.com
```

### 3. **Using Old Implementation**

**Issue:** Your production server is still using the old OAuth service.

**Solution:** Deploy the new clean implementation we just created.

## 🔧 Testing Your Setup

### Test 1: Health Check

Visit: `https://money-monitoring.onrender.com/api/auth/google/health`

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

### Test 2: OAuth URL Generation

Visit: `https://money-monitoring.onrender.com/api/auth/google/url`

**Expected Response:**

```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
  "codeVerifier": "..."
}
```

### Test 3: Manual OAuth Flow

1. Get the OAuth URL from Test 2
2. Visit the URL in your browser
3. Authorize with Google
4. Check the callback URL for detailed logs

## 🚨 Debugging Steps

### Step 1: Check Your Logs

Look for these log entries when testing:

```bash
# Expected logs:
Google OAuth Configuration: { ... }
Google OAuth callback received: { ... }
Handling legacy Google OAuth callback (without PKCE)
Legacy token exchange response status: 200
Google OAuth callback successful: { ... }
```

### Step 2: Common Error Messages

**"redirect_uri_mismatch"**

```
Error: redirect_uri_mismatch
```

**Solution:** Update your Google Cloud Console redirect URI to exactly match.

**"invalid_client"**

```
Error: invalid_client
```

**Solution:** Check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.

**"invalid_grant"**

```
Error: invalid_grant
```

**Solution:** The authorization code expired or was already used.

### Step 3: Google Cloud Console Setup

1. **Go to Google Cloud Console**
2. **Navigate to:** APIs & Services → Credentials
3. **Find your OAuth 2.0 Client ID**
4. **Add these redirect URIs:**
   ```
   https://money-monitoring.onrender.com/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback (for development)
   ```

### Step 4: Test with cURL

Test the token exchange manually:

```bash
# Get the authorization code from the callback URL
# Then test the token exchange:
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=https://money-monitoring.onrender.com/api/auth/google/callback"
```

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] Environment variables are set correctly
- [ ] Google Cloud Console has the correct redirect URI
- [ ] New Google OAuth service is deployed
- [ ] Routes are updated to use new controller
- [ ] Backend and frontend URLs are correct

## 🔍 Advanced Debugging

### Enable Detailed Logging

The new implementation includes detailed logging. Check your server logs for:

```bash
# Configuration logs
Google OAuth Configuration: {...}

# Token exchange logs
Exchanging code for tokens: {...}
Token exchange response status: 200
Token exchange successful: {...}

# Error logs (if any)
Token exchange failed: {...}
```

### Test Different Scenarios

1. **Test from different browsers/devices**
2. **Test with incognito/private mode**
3. **Test with different Google accounts**
4. **Test the mobile PKCE flow vs web callback flow**

## 🎯 Quick Fixes

### Fix 1: Update Redirect URI

```bash
# In Google Cloud Console, change:
# FROM: https://money-monitoring.onrender.com/api/auth/google/callback/
# TO:   https://money-monitoring.onrender.com/api/auth/google/callback
```

### Fix 2: Check Environment Variables

```bash
# In your deployment platform (Render.com):
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
echo $BACKEND_BASE_URL
```

### Fix 3: Use the New Callback Endpoint

Your callback is now handled by the new clean implementation with better error handling and logging.

## 🆘 Still Having Issues?

1. **Check the health endpoint first**
2. **Review your server logs for detailed error messages**
3. **Verify your Google Cloud Console settings**
4. **Test with a fresh authorization code**

The new implementation provides much better error messages and logging to help you debug any remaining issues.
