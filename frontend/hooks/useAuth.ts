import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, setLoading, setError, clearError } = useAuthStore();

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

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending,
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };
}; 