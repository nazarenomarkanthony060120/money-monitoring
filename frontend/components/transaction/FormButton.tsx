import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface FormButtonProps {
  title: string
  onPress: () => void
  isLoading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const isDisabled = disabled || isLoading

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        className={`mt-6 py-4 px-6 rounded-2xl border-2 ${
          isDisabled
            ? 'bg-gray-100 border-gray-300'
            : 'bg-white border-blue-400'
        } shadow-sm`}
        accessibilityLabel={title}
      >
        <View className="flex-row items-center justify-center">
          {isLoading && (
            <ActivityIndicator size="small" color="#3B82F6" className="mr-2" />
          )}
          <Text
            className={`font-semibold text-lg ${
              isDisabled ? 'text-gray-400' : 'text-blue-600'
            }`}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`mt-6 rounded-2xl shadow-lg ${
        isDisabled ? 'opacity-50' : 'opacity-100'
      }`}
      accessibilityLabel={title}
    >
      <LinearGradient
        colors={isDisabled ? ['#D1D5DB', '#9CA3AF'] : ['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="py-4 px-6 rounded-2xl"
      >
        <View className="flex-row items-center justify-center">
          {isLoading && (
            <ActivityIndicator size="small" color="white" className="mr-2" />
          )}
          <Text className="text-white font-semibold text-lg">
            {isLoading ? 'Processing...' : title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}
