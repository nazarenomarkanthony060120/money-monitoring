import { useState } from 'react';
import { User } from '../types/auth';
import { useRouter } from 'expo-router';
import { frontendDiscordService } from '../services/discordService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });
  const router = useRouter();

  const setLoading = (loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setError(null);
  };

  const setAuthData = (user: User, token: string) => {
    setAuthState(prev => ({
      ...prev,
      user,
      token,
      isLoading: false,
      error: null,
    }));
  };

  const login = (user: User, token: string) => {
    setAuthData(user, token);

    // Setup Discord error reporting for this user
    frontendDiscordService.setupGlobalErrorHandlers(user.id);

    // Navigate to dashboard after successful login
    router.replace('/(tabs)/home');
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });

    // Navigate back to login screen
    router.replace('/');
  };

  return {
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: !!authState.user && !!authState.token,
    loginWithTokenAndUser: login,
    logout,
    clearError,
  };
}; 