import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryText?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to load dashboard data. Please try again.',
  onRetry,
  retryText = 'Retry',
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <Text className="text-6xl mb-4">😕</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-base mb-6 text-center leading-6">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-blue-600 px-6 py-3 rounded-xl active:scale-95"
          accessibilityLabel={retryText}
          accessibilityRole="button"
        >
          <Text className="text-white font-semibold text-base">
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
