export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'discord';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthProvider {
  id: 'google' | 'facebook' | 'discord';
  name: string;
  icon: string;
  color: string;
}

export interface AuthError {
  code: string;
  message: string;
} 