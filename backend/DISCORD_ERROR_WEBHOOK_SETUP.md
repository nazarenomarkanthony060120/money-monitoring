# Discord Webhook Error Reporting Setup

This document explains how to set up Discord webhook integration for error reporting in the Money Monitoring application.

## Overview

The application includes a comprehensive error reporting system that sends both frontend and backend errors to a Discord channel via webhooks. This helps with monitoring application health and debugging issues in real-time.

## Features

- **Backend Error Reporting**: Automatically sends server errors, API errors, and uncaught exceptions
- **Frontend Error Reporting**: Captures React Native/web errors, uncaught exceptions, and custom errors
- **Rich Error Information**: Includes stack traces, user context, environment details, and device information
- **Severity Levels**: Different handling for development vs production errors
- **Error Filtering**: Prevents spam by filtering out non-critical development errors

## Setup Instructions

### 1. Create Discord Webhook

1. **Open Discord** and navigate to your server
2. **Right-click** on the channel where you want to receive error reports
3. **Select "Edit Channel"** from the context menu
4. **Go to "Integrations"** tab
5. **Click "Create Webhook"**
6. **Configure the webhook**:
   - Name: `Money Monitoring Errors`
   - Avatar: Optional (you can upload an icon)
7. **Copy the Webhook URL** - it will look like:
   ```
   https://discord.com/api/webhooks/1234567890123456789/abcdefghijklmnopqrstuvwxyz1234567890
   ```

### 2. Configure Environment Variables

Add the Discord webhook URL to your backend environment variables:

```env
# Discord Webhook for Error Reporting
DISCORD_WEB_HOOK_API=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

### 3. Test the Integration

The application includes built-in testing functionality:

1. **Start the application** in development mode
2. **Navigate to the Profile screen**
3. **Look for the "🧪 Discord Error Testing" section** (only visible in development)
4. **Use the test buttons**:
   - 🧪 **Test Discord Error**: Sends a low-priority test error
   - 🚨 **Test Critical Error**: Sends a critical error (always sent, even in dev)
   - 💥 **Test Uncaught Error**: Throws an uncaught exception to test global handlers

## Error Types and Information

### Backend Errors

Backend errors include the following information:

- **Error Name and Message**: The actual error details
- **Stack Trace**: Full stack trace for debugging
- **HTTP Details**: Endpoint, method, status code
- **User Context**: User ID if authenticated
- **Request Details**: IP address, user agent
- **Environment**: Development/production environment
- **Timestamp**: When the error occurred

### Frontend Errors

Frontend errors include:

- **Error Details**: Name, message, and stack trace
- **User Context**: User ID if logged in
- **Page/Screen**: Current page or screen name
- **Device Info**: Platform, version, model (React Native)
- **Browser Info**: User agent, URL (web)
- **Timestamp**: When the error occurred

## Error Filtering

### Development Environment

- Only critical errors are sent to Discord
- Regular errors are logged to console only
- Test errors can be sent manually

### Production Environment

- All errors with status code 500+ are sent
- Client-side errors are sent immediately
- Sensitive information is filtered out

## Discord Message Format

Errors appear in Discord as rich embeds with:

- **Color Coding**:
  - 🔴 Red: Backend errors
  - 🟠 Orange: Frontend errors
  - 🟡 Yellow: Warnings
- **Organized Fields**: Error details in easy-to-read format
- **Timestamps**: When the error occurred
- **Footer**: Application identifier

## API Endpoints

### Backend Error Reporting

- **Endpoint**: `POST /api/error/discord`
- **Purpose**: Accepts frontend errors and forwards to Discord
- **Authentication**: Not required (for error reporting)

### Automatic Backend Error Handling

- **Global Error Middleware**: Catches all uncaught backend errors
- **404 Handler**: Reports missing routes
- **Async Error Wrapper**: Handles promise rejections

## Code Integration

### Frontend Error Reporting

```typescript
import { frontendDiscordService } from "../services/discordService";

// Manual error reporting
await frontendDiscordService.sendCustomError(
  "Error Title",
  "Error description",
  {
    userId: "user123",
    page: "Profile Screen",
    severity: "critical",
  }
);

// Setup global error handlers
frontendDiscordService.setupGlobalErrorHandlers(userId);
```

### Backend Error Handling

```typescript
import { discordService } from "../services/discordService";

// Manual error reporting
await discordService.sendErrorToDiscord({
  error: "DatabaseError",
  message: "Failed to connect to database",
  stack: error.stack,
  environment: "production",
  source: "backend",
});

// Automatic via middleware (already configured)
app.use(errorHandler);
```

## Security Considerations

1. **Webhook URL Protection**: Keep the Discord webhook URL secret
2. **Rate Limiting**: Discord has rate limits (30 requests per minute)
3. **Data Sanitization**: Sensitive data is filtered from error reports
4. **Environment Separation**: Different behavior for dev/prod environments

## Troubleshooting

### Common Issues

1. **Webhook URL Invalid**

   - Verify the URL format is correct
   - Check that the webhook still exists in Discord
   - Ensure no extra characters or spaces

2. **No Errors Appearing**

   - Check if you're in development mode (limited error sending)
   - Verify the webhook URL is set correctly
   - Check console logs for Discord service errors

3. **Too Many Errors**
   - Errors are automatically throttled
   - Consider adjusting error filtering logic
   - Check for infinite error loops

### Testing Commands

```bash
# Test backend error reporting
curl -X POST http://localhost:5000/api/error/discord \
  -H "Content-Type: application/json" \
  -d '{"error":"TestError","message":"Test error message","source":"frontend"}'
```

## Monitoring and Maintenance

- **Regular Webhook Checks**: Ensure the Discord webhook is still active
- **Error Volume Monitoring**: Watch for unusual error spikes
- **Webhook Rotation**: Consider rotating webhook URLs periodically for security
- **Channel Organization**: Use different channels for different error types if needed

## Advanced Configuration

### Custom Error Filters

You can customize which errors are sent by modifying the error handler:

```typescript
// In errorHandler.ts
if (shouldSendToDiscord(err, req)) {
  await discordService.sendErrorToDiscord(errorPayload);
}
```

### Multiple Webhooks

For different environments or error types:

```env
DISCORD_WEB_HOOK_API_PROD=https://discord.com/api/webhooks/prod/token
DISCORD_WEB_HOOK_API_DEV=https://discord.com/api/webhooks/dev/token
```

This setup provides comprehensive error monitoring and helps maintain application reliability by providing real-time error notifications to your Discord server.
