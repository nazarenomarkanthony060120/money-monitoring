import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { User, LoginResponse } from '../types/auth';
import { useRouter } from 'expo-router';

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

  const login = (user: User, token: string) => {
    setAuthState(prev => ({
      ...prev,
      user,
      token,
      isLoading: false,
      error: null,
    }));

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

  const loginMutation = useMutation({
    mutationFn: async (provider: 'google' | 'facebook' | 'discord') => {
      setLoading(true);
      clearError();

      try {
        const response = await authService.loginWithProvider(provider);
        login(response.user, response.token);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        setError(errorMessage);
        throw error;
      }
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
    },
  });

  const handleLogin = async (provider: 'google' | 'facebook' | 'discord') => {
    try {
      await loginMutation.mutateAsync(provider);
    } catch (error) {
      // Error is already handled in the mutation
      console.error('Login error:', error);
    }
  };

  return {
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading || loginMutation.isPending,
    error: authState.error,
    login: handleLogin,
    logout,
    clearError,
  };
}; 