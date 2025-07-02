import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

interface LoadingStateProps {
  message?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading dashboard...',
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-gray-600 text-base mt-4 text-center">
        {message}
      </Text>
    </View>
  )
}
