# Discord OAuth2 Implementation

This document explains how to set up and use Discord OAuth2 authentication based on the [Discord Developer Documentation](http://discord.com/developers/docs/topics/oauth2).

## Setup

### 1. Discord Application Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Navigate to the "OAuth2" section
4. Add your redirect URIs:
   - Development: `http://localhost:5000/api/auth/discord/callback`
   - Production: `https://yourdomain.com/api/auth/discord/callback`
5. Copy your Client ID and Client Secret

### 2. Environment Variables

Add the following to your `.env` file:

```env
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

## API Endpoints

### 1. Generate Authorization URL

**GET** `/api/auth/discord/url`

**Query Parameters:**

- `redirectUri` (required): The redirect URI for your application
- `state` (optional): State parameter for CSRF protection

**Response:**

```json
{
  "success": true,
  "message": "Discord authorization URL generated successfully",
  "data": {
    "authUrl": "https://discord.com/api/oauth2/authorize?client_id=...",
    "clientId": "your-discord-client-id"
  }
}
```

### 2. Handle OAuth2 Callback

**POST** `/api/auth/discord/callback`

**Body:**

```json
{
  "code": "authorization-code-from-discord",
  "redirectUri": "your-redirect-uri"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Discord authentication successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "username#discriminator",
      "email": "user@example.com",
      "picture": "https://cdn.discordapp.com/avatars/...",
      "provider": "discord",
      "isEmailVerified": true
    },
    "token": "jwt-token"
  }
}
```

### 3. Direct Discord Login

**POST** `/api/login/discord`

**Body:**

```json
{
  "code": "authorization-code-from-discord",
  "redirectUri": "your-redirect-uri"
}
```

**Response:** Same as callback endpoint

## OAuth2 Flow

### 1. Authorization Request

Direct users to the authorization URL with these parameters:

- `client_id`: Your Discord application's client ID
- `redirect_uri`: Your registered redirect URI
- `response_type`: `code`
- `scope`: `identify email`
- `state`: (optional) CSRF protection token

Example URL:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=identify%20email
```

### 2. Authorization Code Exchange

When Discord redirects back to your application with the authorization code, exchange it for an access token:

1. Make a POST request to `https://discord.com/api/oauth2/token`
2. Include the authorization code, client credentials, and redirect URI
3. Receive access token and refresh token

### 3. User Information Retrieval

Use the access token to fetch user information:

1. Make a GET request to `https://discord.com/api/users/@me`
2. Include the access token in the Authorization header
3. Parse user data and create/update user account

## Frontend Integration

### React Native / Expo Example

```typescript
import { Linking } from "react-native";

const loginWithDiscord = async () => {
  try {
    // 1. Get authorization URL
    const response = await fetch(
      "/api/auth/discord/url?redirectUri=your-app-scheme://discord"
    );
    const { data } = await response.json();

    // 2. Open Discord authorization in browser
    await Linking.openURL(data.authUrl);

    // 3. Handle deep link callback (implement deep link handler)
    // When user returns to app with authorization code, call:
    const authResponse = await fetch("/api/login/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "authorization-code-from-callback",
        redirectUri: "your-app-scheme://discord",
      }),
    });

    const authResult = await authResponse.json();
    // Handle successful authentication
  } catch (error) {
    console.error("Discord authentication error:", error);
  }
};
```

### Web Application Example

```typescript
const loginWithDiscord = async () => {
  try {
    // 1. Get authorization URL
    const response = await fetch(
      "/api/auth/discord/url?redirectUri=" +
        encodeURIComponent(window.location.origin + "/auth/discord/callback")
    );
    const { data } = await response.json();

    // 2. Redirect to Discord authorization
    window.location.href = data.authUrl;

    // 3. Handle callback on your callback page
    // Extract code from URL parameters and call:
    const authResponse = await fetch("/api/login/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: urlParams.get("code"),
        redirectUri: window.location.origin + "/auth/discord/callback",
      }),
    });

    const authResult = await authResponse.json();
    // Handle successful authentication
  } catch (error) {
    console.error("Discord authentication error:", error);
  }
};
```

## User Data Mapping

Discord user data is mapped to our user schema as follows:

| Discord Field            | Our Field         | Notes                               |
| ------------------------ | ----------------- | ----------------------------------- |
| `id`                     | `id`              | Discord user ID                     |
| `username#discriminator` | `name`            | Combined username and discriminator |
| `email`                  | `email`           | User's email (requires email scope) |
| `avatar`                 | `picture`         | Generated avatar URL                |
| `verified`               | `isEmailVerified` | Email verification status           |

## Avatar URL Generation

Discord avatars are constructed as follows:

- **Custom Avatar**: `https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png`
- **Default Avatar**: `https://cdn.discordapp.com/embed/avatars/{discriminator % 5}.png`

## Error Handling

Common error scenarios:

1. **Invalid Authorization Code**: Returns 401 with "Failed to exchange Discord authorization code"
2. **Missing Email**: Returns 400 with "Discord account must have a verified email address"
3. **API Errors**: Returns 500 with "Discord authentication failed"

## Security Considerations

1. **State Parameter**: Use the `state` parameter to prevent CSRF attacks
2. **Redirect URI Validation**: Ensure redirect URIs are properly validated
3. **Token Storage**: Store JWT tokens securely on the client side
4. **HTTPS**: Always use HTTPS in production for OAuth2 flows

## Testing

Use the Discord OAuth2 testing tools:

1. Test authorization URL generation
2. Test callback handling with valid/invalid codes
3. Test error scenarios (missing email, invalid tokens)
4. Verify user data mapping and avatar URL generation

## References

- [Discord OAuth2 Documentation](http://discord.com/developers/docs/topics/oauth2)
- [Discord API Reference](https://discord.com/developers/docs/reference)
- [OAuth2 RFC](https://tools.ietf.org/html/rfc6749)
