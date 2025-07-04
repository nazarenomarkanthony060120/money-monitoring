import React from 'react'
import { View, Text } from 'react-native'
import { GoogleSignInButton } from './GoogleSignInButton'

export const LoginForm: React.FC = () => {
  return (
    <View className="space-y-6">
      <View className="space-y-4">
        <Text className="text-center text-gray-300 text-sm">
          Sign in with your preferred method
        </Text>

        <GoogleSignInButton />
      </View>
    </View>
  )
}
