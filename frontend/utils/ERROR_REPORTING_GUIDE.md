# Frontend Error Reporting System

## Overview

This error reporting system automatically sends frontend errors to Discord via the backend route `/api/error/discord` while maintaining proper frontend error display and logging.

## Features

- ✅ **Automatic Discord Reporting**: Errors are sent to Discord via backend
- ✅ **User-Friendly Alerts**: Configurable user notifications
- ✅ **Console Logging**: Maintains developer debugging capabilities
- ✅ **Context Enrichment**: Automatic user ID, page, and action context
- ✅ **Severity Levels**: Categorize errors by importance
- ✅ **Non-Blocking**: Discord failures won't crash your app
- ✅ **Reusable**: Clean utility functions and hooks

## Quick Start

### 1. Using the Hook (Recommended for Components)

```tsx
import React from 'react'
import { useErrorReporting } from '../hooks/useErrorReporting'

export const MyComponent = () => {
  const { reportAuthError, reportApiError, wrapAsync } = useErrorReporting()

  // Authentication errors with user alerts
  const handleLogin = async () => {
    try {
      await someAuthFunction()
    } catch (error) {
      reportAuthError(error as Error, 'Google', {
        userMessage: 'Login failed. Please try again.',
      })
    }
  }

  // API errors
  const fetchData = async () => {
    try {
      await api.getData()
    } catch (error) {
      reportApiError(error as Error, '/api/users')
    }
  }

  // Wrap async functions with automatic error reporting
  const handleSubmit = wrapAsync(
    async () => {
      await submitForm()
    },
    { action: 'Submit Form' },
  )

  return (
    <View>
      <Button onPress={handleLogin} title="Login" />
      <Button onPress={fetchData} title="Fetch Data" />
      <Button onPress={handleSubmit} title="Submit" />
    </View>
  )
}
```

### 2. Using Utility Functions (Recommended for Services)

```tsx
import {
  reportApiError,
  reportAuthError,
  reportSilentError,
} from '../utils/errorReporting'

// In service files
export class ApiService {
  static async getData() {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      return response.json()
    } catch (error) {
      reportApiError(error as Error, '/api/data', {
        severity: 'medium',
      })
      throw error // Re-throw for component to handle
    }
  }
}
```

## API Reference

### Hook: `useErrorReporting()`

Provides error reporting functions with automatic context (user ID, current page).

#### Returns

```typescript
{
  reportError: (error: Error | string, context?: ErrorContext, options?: ErrorReportingOptions) => Promise<void>;
  reportAuthError: (error: Error | string, provider: string, context?: Omit<ErrorContext, 'action'>) => void;
  reportApiError: (error: Error | string, endpoint: string, context?: Omit<ErrorContext, 'action'>) => void;
  reportCriticalError: (error: Error | string, context?: ErrorContext) => void;
  reportSilentError: (error: Error | string, context?: ErrorContext) => void;
  wrapAsync: <T>(fn: (...args: T[]) => Promise<R>, errorContext?: ErrorContext) => (...args: T[]) => Promise<R>;
  wrapApiCall: <T>(fn: (...args: T[]) => Promise<R>, endpoint: string, errorContext?: ErrorContext) => (...args: T[]) => Promise<R>;
}
```

#### Examples

```tsx
const { reportAuthError, reportApiError, wrapAsync } = useErrorReporting()

// Authentication error with custom user message
reportAuthError(error, 'Google', {
  severity: 'high',
  userMessage: 'Google sign in failed. Please try again.',
})

// API error with endpoint context
reportApiError(error, '/api/users', {
  severity: 'medium',
})

// Wrap function with automatic error reporting
const safeAsyncFunction = wrapAsync(riskyAsyncFunction, {
  action: 'Process Payment',
  severity: 'critical',
})
```

### Utility Functions

#### `reportError(error, context?, options?)`

General error reporting with full customization.

```typescript
reportError(
  new Error('Something went wrong'),
  {
    userId: 'user123',
    page: '/dashboard',
    action: 'Save Data',
    severity: 'medium',
    userMessage: 'Failed to save. Please try again.',
  },
  {
    showUserAlert: true,
    sendToDiscord: true,
  },
)
```

#### `reportAuthError(error, provider, context?)`

Specialized for authentication errors. Automatically shows user alerts.

```typescript
reportAuthError(error, 'Google', {
  severity: 'high',
  userMessage: 'Custom error message for user',
})
```

#### `reportApiError(error, endpoint, context?)`

Specialized for API errors with endpoint context.

```typescript
reportApiError(error, '/api/users', {
  severity: 'medium',
  userId: 'user123',
})
```

#### `reportCriticalError(error, context?)`

For critical errors that need immediate attention. Automatically shows alerts.

```typescript
reportCriticalError(error, {
  action: 'Payment Processing',
  userMessage: 'A critical error occurred. Please contact support.',
})
```

#### `reportSilentError(error, context?)`

For background errors that shouldn't show user alerts.

```typescript
reportSilentError(error, {
  action: 'Background Sync',
  severity: 'low',
})
```

## Context Options

### `ErrorContext`

```typescript
interface ErrorContext {
  userId?: string // User ID (auto-filled by hook)
  page?: string // Current page/screen (auto-filled by hook)
  action?: string // What the user was doing
  severity?: 'low' | 'medium' | 'high' | 'critical'
  showAlert?: boolean // Override default alert behavior
  alertTitle?: string // Custom alert title
  userMessage?: string // User-friendly error message
}
```

### `ErrorReportingOptions`

```typescript
interface ErrorReportingOptions {
  logToConsole?: boolean // Default: true
  sendToDiscord?: boolean // Default: true
  showUserAlert?: boolean // Default: false (except for auth/critical)
  isBlocking?: boolean // Default: false
}
```

## Error Severity Levels

- **`low`**: Background errors, non-critical failures
- **`medium`**: API failures, recoverable errors
- **`high`**: Authentication failures, important feature breaks
- **`critical`**: Payment failures, data corruption, security issues

## Best Practices

### 1. Choose the Right Function

```tsx
// ✅ Use specific functions when possible
reportAuthError(error, 'Google') // For auth
reportApiError(error, '/api/users') // For API calls
reportCriticalError(error) // For critical issues

// ❌ Don't use generic function for specific cases
reportError(error) // Too generic
```

### 2. Provide Context

```tsx
// ✅ Good: Provides context
reportError(error, {
  action: 'Submit Payment Form',
  severity: 'critical',
  userMessage: 'Payment failed. Please check your card details.',
})

// ❌ Bad: No context
reportError(error)
```

### 3. Handle Re-thrown Errors

```tsx
// ✅ Good: Service reports and re-throws, component handles UI
// Service:
try {
  await apiCall()
} catch (error) {
  reportApiError(error, '/api/data')
  throw error // Re-throw for component
}

// Component:
try {
  await service.getData()
} catch (error) {
  // Handle UI state (loading, etc.)
  setLoading(false)
}
```

### 4. Use Wrapper Functions

```tsx
// ✅ Good: Automatic error handling
const { wrapAsync } = useErrorReporting()

const handleSubmit = wrapAsync(
  async () => {
    await submitForm()
    await saveData()
  },
  { action: 'Submit Form', severity: 'high' },
)

// ❌ Manual error handling in every function
const handleSubmit = async () => {
  try {
    await submitForm()
    await saveData()
  } catch (error) {
    reportError(error, { action: 'Submit Form' })
  }
}
```

## Integration Examples

### React Native Component

```tsx
import React from 'react'
import { View, Button, Alert } from 'react-native'
import { useErrorReporting } from '../hooks/useErrorReporting'

export const PaymentComponent = () => {
  const { reportCriticalError, wrapAsync } = useErrorReporting()

  const processPayment = wrapAsync(
    async (amount: number) => {
      const result = await paymentService.charge(amount)
      return result
    },
    {
      action: 'Process Payment',
      severity: 'critical',
      userMessage: 'Payment failed. Please check your payment method.',
    },
  )

  return (
    <View>
      <Button title="Pay Now" onPress={() => processPayment(100)} />
    </View>
  )
}
```

### Service Integration

```tsx
// services/authService.ts
import { reportAuthError, reportApiError } from '../utils/errorReporting'

export class AuthService {
  static async signInWithGoogle() {
    try {
      const response = await fetch('/api/auth/google')
      if (!response.ok) {
        throw new Error('Google auth failed')
      }
      return response.json()
    } catch (error) {
      reportAuthError(error as Error, 'Google', {
        severity: 'high',
      })
      throw error
    }
  }
}
```

## Discord Message Format

Errors appear in Discord as clean embeds:

```
🚨 FRONTEND ERROR 🚨
🔥 Error
```

Google OAuth callback failed

```

💬 Details
Failed to exchange authorization code

📋 Context
📍 `/auth/signin` • 👤 `user123` • 🔧 `frontend`

📋 Action
Google Authentication

📋 Stack Trace
```

Error: Google OAuth callback failed
at GoogleAuthService.exchangeCodeForTokens (services/googleAuth.ts:45)
at useGoogleAuth.signInWithGoogle (hooks/useGoogleAuth.ts:32)

```

Error occurred at 2024-01-15T10:30:00.000Z
Money Monitoring • Error Reporter
```

## Migration from Alert.alert

### Before

```tsx
catch (error) {
  console.error('Error:', error);
  Alert.alert('Error', error.message);
}
```

### After

```tsx
catch (error) {
  reportAuthError(error as Error, 'Google', {
    userMessage: 'Sign in failed. Please try again.',
  });
}
```

The new system automatically handles console logging, Discord reporting, and user alerts! 🎉
