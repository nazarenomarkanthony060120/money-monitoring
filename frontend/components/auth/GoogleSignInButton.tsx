import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import useErrorReporting from '../../hooks/useErrorReporting'

interface GoogleSignInButtonProps {
  disabled?: boolean
  style?: string
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  disabled = false,
  style,
}) => {
  const { signInWithGoogle, isLoading, clearError } = useGoogleAuth()
  const { reportAuthError } = useErrorReporting()

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) return

    try {
      clearError()
      await signInWithGoogle()
      // Navigation to home screen is handled automatically by the useAuth hook
    } catch (error) {
      // Report error to Discord and show user alert
      reportAuthError(error as Error, 'Google', {
        severity: 'high',
        userMessage:
          'Google sign in failed. Please try again or contact support if this persists.',
      })
    }
  }

  return (
    <TouchableOpacity
      className={`
        bg-blue-500 
        py-4 px-6 
        rounded-xl 
        items-center 
        justify-center 
        shadow-md 
        mb-4
        ${disabled ? 'bg-gray-300' : 'active:bg-blue-600'}
        ${style || ''}
      `}
      onPress={handleGoogleSignIn}
      disabled={disabled || isLoading}
    >
      <View className="flex-row items-center justify-center">
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" className="mr-2" />
        ) : (
          <>
            <View className="bg-white rounded-xl w-6 h-6 items-center justify-center mr-3">
              <Text className="text-blue-500 font-bold text-lg leading-6">
                G
              </Text>
            </View>
            <Text className="text-white text-base font-semibold">
              Continue with Google
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}
