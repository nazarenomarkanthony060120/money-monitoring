import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from './useAuth';
import { googleAuthService, GoogleAuthResult } from '../services/googleAuthService';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthState {
  isLoading: boolean;
  error: string | null;
}

export const useGoogleAuth = () => {
  const auth = useAuth();
  const [googleAuthState, setGoogleAuthState] = useState<GoogleAuthState>({
    isLoading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setGoogleAuthState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setGoogleAuthState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setError(null);
  };

  const signInWithGoogle = async (): Promise<void> => {
    if (googleAuthState.isLoading) return;

    setLoading(true);
    clearError();

    try {
      // Step 1: Get OAuth URL with PKCE challenge from backend
      const { authUrl, codeVerifier } = await googleAuthService.getOAuthUrl();

      // Step 2: Open OAuth URL in browser
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        googleAuthService.generateMobileRedirectUri()
      );

      if (result.type === 'success' && result.url) {
        // Step 3: Parse callback result
        const callbackResult = googleAuthService.parseCallbackUrl(result.url);

        let authResult: GoogleAuthResult;

        if (callbackResult.type === 'token') {
          // Direct token from web callback flow
          authResult = callbackResult.data as GoogleAuthResult;
        } else {
          // Authorization code - exchange for tokens using PKCE
          const { code, state } = callbackResult.data as { code: string; state?: string };
          authResult = await googleAuthService.exchangeCodeForTokens(code, codeVerifier, state);
        }

        // Step 4: Use existing auth hook to login (this will navigate to home)
        auth.loginWithTokenAndUser(authResult.user, authResult.token);

      } else if (result.type === 'cancel') {
        setError('User cancelled authentication');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Google OAuth error:', error);
      setError(errorMessage);
      throw error; // Re-throw for component to handle if needed
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading: googleAuthState.isLoading || auth.isLoading,
    error: googleAuthState.error || auth.error,
    clearError: () => {
      clearError();
      auth.clearError();
    },
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
  };
};

export default useGoogleAuth; 