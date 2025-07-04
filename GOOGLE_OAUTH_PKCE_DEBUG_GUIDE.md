# Google OAuth PKCE Debug Guide

## 🎯 **The Problem You Had**

Your Google OAuth was failing with "**Missing code verifier**" because:

1. ✅ **Frontend generated OAuth URL** with PKCE (`code_challenge` + `code_verifier`)
2. ✅ **User authorized with Google** successfully
3. ❌ **Google redirected to web callback** `/api/auth/google/callback`
4. ❌ **Web callback had no access to `code_verifier`** (it was generated on frontend)
5. ❌ **Backend fell back to legacy method** without PKCE

## 🔧 **The Fix: Server-Side PKCE Storage**

We've implemented **server-side PKCE session storage** that:

1. **Stores `code_verifier`** associated with `state` parameter when generating OAuth URL
2. **Retrieves `code_verifier`** during callback using the `state` parameter
3. **Uses proper PKCE flow** for token exchange
4. **Cleans up expired sessions** automatically

## 🧪 **Testing Your Fix**

### Step 1: Check Backend Health

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

### Step 2: Generate OAuth URL (Creates PKCE Session)

```bash
curl https://money-monitoring.onrender.com/api/auth/google/url
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

### Step 3: Check PKCE Sessions (Debug)

```bash
curl https://money-monitoring.onrender.com/api/auth/google/debug
```

**Expected Response:**

```json
{
  "status": "ok",
  "pkceStoreSize": 1,
  "activeSessions": 1,
  "sessions": [
    {
      "state": "bgxVrzrYuoS...",
      "hasCodeVerifier": true,
      "redirectUri": "https://money-monitoring.onrender.com/api/auth/google/callback",
      "age": 30000,
      "timestamp": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### Step 4: Test Full OAuth Flow

1. **Get OAuth URL** from Step 2
2. **Visit the authUrl** in your browser
3. **Authorize with Google**
4. **Check logs** for success messages

## 📋 **Expected Log Messages**

### During OAuth URL Generation:

```
Google OAuth Configuration: { ... }
Generated OAuth URL: { ... }
Stored PKCE session for state: bgxVrzrYuoS...
```

### During Callback:

```
Google OAuth callback received: { hasCode: true, hasState: true, hasError: false }
Handling Google OAuth web callback with PKCE
Retrieved PKCE session: { hasCodeVerifier: true, redirectUri: "...", sessionAge: 30000 }
Exchanging code for tokens: { code: "...", codeVerifier: "...", redirectUri: "...", isMobile: false }
Token exchange response status: 200
Token exchange successful: { hasAccessToken: true, hasIdToken: true, ... }
ID token verified successfully: { userId: "...", email: "...", ... }
Google OAuth web callback completed successfully: { userId: "...", userEmail: "...", ... }
```

## 🚨 **Troubleshooting**

### Error: "Invalid or expired state parameter"

**Cause:** PKCE session not found or expired (10 minutes)

**Solution:**

1. Generate a fresh OAuth URL
2. Complete the flow within 10 minutes
3. Check debug endpoint to see if session exists

### Error: "redirect_uri_mismatch"

**Cause:** Google Cloud Console redirect URI doesn't match

**Solution:**

1. Check your Google Cloud Console
2. Ensure exact match: `https://money-monitoring.onrender.com/api/auth/google/callback`
3. No trailing slash, exact protocol

### Error: "Missing code verifier" (Legacy Flow)

**Cause:** Code fell back to legacy method

**Solution:**

1. Ensure you're using the new backend code
2. Check that `state` parameter is present in callback
3. Verify PKCE session exists in debug endpoint

## 🔍 **How the Fixed Flow Works**

### **Step 1: Generate OAuth URL**

```
Frontend -> GET /api/auth/google/url
Backend -> Generates code_verifier, code_challenge, state
Backend -> Stores { state: { codeVerifier, redirectUri, timestamp } }
Backend -> Returns { authUrl, codeVerifier }
```

### **Step 2: User Authorization**

```
User -> Visits authUrl
Google -> User authorizes
Google -> Redirects to callback with code + state
```

### **Step 3: Token Exchange**

```
Backend -> Receives callback with code + state
Backend -> Retrieves codeVerifier using state
Backend -> Exchanges code + codeVerifier for tokens
Backend -> Verifies ID token
Backend -> Creates user session
```

## 📊 **Debugging Commands**

### Check Current Sessions

```bash
curl https://money-monitoring.onrender.com/api/auth/google/debug
```

### Test OAuth URL Generation

```bash
curl -s https://money-monitoring.onrender.com/api/auth/google/url | jq '.'
```

### Check Health Status

```bash
curl -s https://money-monitoring.onrender.com/api/auth/google/health | jq '.'
```

### Monitor Logs

```bash
# On your server, watch for these patterns:
tail -f /var/log/your-app.log | grep -E "(OAuth|PKCE|state|code_verifier)"
```

## 🎯 **Success Criteria**

✅ **OAuth URL generation** creates PKCE session
✅ **Debug endpoint** shows active sessions
✅ **Callback logs** show "Retrieved PKCE session"
✅ **Token exchange** succeeds with proper PKCE
✅ **User authentication** completes successfully

## 🔄 **Session Management**

- **Sessions expire** after 10 minutes
- **Sessions are cleaned up** automatically
- **Sessions are removed** after successful use (prevents replay attacks)
- **Failed sessions** are logged for debugging

## 🚀 **Production Deployment**

1. **Deploy the new backend** with PKCE storage
2. **Test the debug endpoint** to verify sessions
3. **Test the full OAuth flow** end-to-end
4. **Monitor logs** for any issues
5. **Remove debug endpoint** in production (optional)

Your Google OAuth PKCE implementation should now work correctly with proper server-side session storage!
