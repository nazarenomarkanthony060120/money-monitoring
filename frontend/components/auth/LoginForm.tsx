import React, { useState } from 'react'
import { View, Text, Alert } from 'react-native'
import { GoogleSignInButton } from './GoogleSignInButton'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'expo-router'

export const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuthStore()
  const router = useRouter()

  const handleGoogleSuccess = (result: any) => {
    try {
      // Store authentication data
      login(result.user, result.token)

      // Navigate to main app
      router.push('/(tabs)/home')

      // Show success message
      Alert.alert(
        'Welcome!',
        `Hello ${result.user.name}! You have been successfully signed in.`,
        [{ text: 'OK' }],
      )
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to complete sign in')
    }
  }

  const handleGoogleError = (error: string) => {
    setError(error)
    console.error('Google sign in error:', error)
  }

  return (
    <View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
      <Text className="text-white text-center mb-6 text-xl font-semibold">
        Sign in to continue
      </Text>

      {/* Error Message */}
      {error && (
        <View className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
          <Text className="text-red-200 text-center font-medium">{error}</Text>
        </View>
      )}

      {/* Google Sign In Button */}
      <GoogleSignInButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      <Text className="text-white/60 text-center text-sm mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  )
}
