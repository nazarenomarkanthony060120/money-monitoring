// Simple auth service for type definitions and utilities

export interface AuthProvider {
  id: 'google' | 'facebook' | 'discord'
  name: string
  icon: string
  color: string
}

export const AUTH_PROVIDERS: AuthProvider[] = [
  {
    id: 'google',
    name: 'Continue with Google',
    icon: 'G',
    color: '#4285F4',
  },
  {
    id: 'facebook',
    name: 'Continue with Facebook',
    icon: 'f',
    color: '#1877F2',
  },
  {
    id: 'discord',
    name: 'Continue with Discord',
    icon: 'D',
    color: '#5865F2',
  },
]

export const getAuthProvider = (providerId: string) => {
  return AUTH_PROVIDERS.find(provider => provider.id === providerId)
} 