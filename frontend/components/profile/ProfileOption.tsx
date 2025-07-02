import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

interface ProfileOptionProps {
  icon: string
  title: string
  subtitle?: string
  onPress: () => void
  showBorder?: boolean
  testID?: string
}

export const ProfileOption: React.FC<ProfileOptionProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showBorder = true,
  testID,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `: ${subtitle}` : ''}`}
      accessibilityHint="Tap to access this option"
    >
      {/* Icon Container */}
      <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4">
        <Text className="text-xl" accessibilityLabel={`${title} icon`}>
          {icon}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text
          className="text-gray-900 font-semibold text-base"
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Chevron */}
      <Text
        className="text-gray-400 text-lg ml-2"
        accessibilityLabel="Navigate"
      >
        ›
      </Text>
    </TouchableOpacity>
  )
}
