# Google Authentication Architecture

## 📁 **Refactored Structure**

The Google authentication has been refactored to follow proper separation of concerns:

```
frontend/
├── services/
│   └── googleAuthService.ts     # Google OAuth API calls
├── hooks/
│   ├── useAuth.ts              # General authentication state management
│   └── useGoogleAuth.ts        # Google-specific authentication logic
└── components/auth/
    └── GoogleSignInButton.tsx  # UI component (UI logic only)
```

## 🎯 **Separation of Concerns**

### **1. Service Layer (`googleAuthService.ts`)**

**Responsibility:** Handle all Google OAuth API communications

- Generate mobile redirect URIs
- Get OAuth URLs from backend
- Exchange authorization codes for tokens
- Parse callback URLs
- No UI logic or state management

```typescript
// Example usage
const { authUrl, codeVerifier } = await googleAuthService.getOAuthUrl()
const authResult = await googleAuthService.exchangeCodeForTokens(
  code,
  codeVerifier,
)
```

### **2. Hook Layer (`useGoogleAuth.ts`)**

**Responsibility:** Handle Google authentication business logic and state

- Orchestrate the OAuth flow
- Manage loading and error states
- Integrate with existing `useAuth` hook
- Handle navigation after successful login
- No UI rendering logic

```typescript
// Example usage
const { signInWithGoogle, isLoading, error } = useGoogleAuth()
```

### **3. Component Layer (`GoogleSignInButton.tsx`)**

**Responsibility:** Handle UI rendering and user interactions

- Render the sign-in button
- Handle button press events
- Show loading states and errors
- No authentication logic or API calls

```typescript
// Simplified component
export const GoogleSignInButton = () => {
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  return (
    <TouchableOpacity onPress={signInWithGoogle}>
      {/* UI rendering only */}
    </TouchableOpacity>
  );
};
```

## 🔄 **Authentication Flow**

### **Complete OAuth Flow:**

1. **User taps button** → Component calls `signInWithGoogle()`
2. **Hook orchestrates** → Calls service to get OAuth URL
3. **Service communicates** → Makes API call to backend
4. **User authorizes** → WebBrowser opens OAuth URL
5. **Google redirects** → App receives callback
6. **Service parses** → Extracts token or authorization code
7. **Hook completes** → Uses existing `useAuth` for state management
8. **Navigation happens** → `useAuth` automatically navigates to home

### **Automatic Features:**

- ✅ **Navigation to Home:** Handled by existing `useAuth.loginWithTokenAndUser()`
- ✅ **Error Handling:** Consistent error states across service and hook
- ✅ **Loading States:** Combined loading from both Google auth and general auth
- ✅ **Discord Integration:** Existing auth hook sets up Discord error reporting
- ✅ **State Management:** Integrated with existing authentication state

## 🎨 **Component Usage**

### **Simple Usage (Recommended):**

```typescript
import { GoogleSignInButton } from './components/auth/GoogleSignInButton';

// In your login screen
<GoogleSignInButton />
```

### **With Custom Styling:**

```typescript
<GoogleSignInButton
  style={{ marginTop: 20 }}
  disabled={someCondition}
/>
```

## 🛡️ **Benefits of This Architecture**

### **1. Separation of Concerns**

- **Service:** Pure API logic, easily testable
- **Hook:** Business logic and state management
- **Component:** UI only, focused and simple

### **2. Reusability**

- Service can be used by other components
- Hook can be used by different UI components
- Component is focused and easily customizable

### **3. Testability**

- Each layer can be unit tested independently
- Service can be mocked for hook testing
- Hook can be mocked for component testing

### **4. Maintainability**

- Clear responsibilities for each file
- Easy to locate and fix issues
- Easy to extend with new features

### **5. Integration**

- Works seamlessly with existing `useAuth` hook
- Automatic navigation to home screen
- Consistent error handling patterns
- Integrates with existing auth state management

## 🔧 **Extending the System**

### **Adding New OAuth Providers:**

1. Create `{provider}AuthService.ts` following the same pattern
2. Create `use{Provider}Auth.ts` hook
3. Create or modify UI components to use the hook

### **Adding Features:**

1. **Service Level:** Add new API methods
2. **Hook Level:** Add new business logic functions
3. **Component Level:** Add new UI elements or interactions

This architecture ensures scalability and maintainability while keeping the code clean and focused.
