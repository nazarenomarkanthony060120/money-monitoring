import React from 'react'
import { View, Text } from 'react-native'
import { LoginButton } from './LoginButton'
import { AUTH_PROVIDERS } from '../../services/authService'

interface LoginFormProps {
  onLogin: (provider: 'google' | 'facebook' | 'discord') => void
  isLoading: boolean
  error?: string
  onClearError?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading,
  error,
  onClearError,
}) => (
  <View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
    <Text className="text-white text-center mb-6 text-xl font-semibold">
      Sign in to continue
    </Text>

    {AUTH_PROVIDERS.map((provider) => (
      <LoginButton
        key={provider.id}
        provider={provider}
        onPress={() => onLogin(provider.id)}
        isLoading={isLoading}
      />
    ))}

    {/* Error Message */}
    {error && (
      <View className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
        <Text className="text-red-200 text-center font-medium">{error}</Text>
      </View>
    )}
  </View>
)
