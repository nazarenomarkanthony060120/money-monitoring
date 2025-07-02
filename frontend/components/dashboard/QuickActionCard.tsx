import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { QuickAction } from '../../types/dashboard'

interface QuickActionCardProps extends QuickAction {
  showBorder?: boolean
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  iconBackgroundColor = '#dbeafe', // blue-50
  showBorder = true,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-1 active:scale-95 ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
      accessibilityLabel={`${title}: ${subtitle}`}
      accessibilityRole="button"
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: iconBackgroundColor }}
      >
        <Text className="text-xl">{icon}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base mb-1">
          {title}
        </Text>
        <Text className="text-gray-500 text-sm leading-5">{subtitle}</Text>
      </View>

      <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center">
        <Text className="text-gray-400 text-lg font-light">›</Text>
      </View>
    </TouchableOpacity>
  )
}
