import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { QuickAction } from '../../types/dashboard'

interface QuickActionCardProps extends QuickAction {}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  iconBackgroundColor = '#dbeafe', // blue-50
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 mb-3"
      accessibilityLabel={`${title}: ${subtitle}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">{title}</Text>
          <Text className="text-gray-500 text-sm">{subtitle}</Text>
        </View>
        <Text className="text-gray-400 text-lg">›</Text>
      </View>
    </TouchableOpacity>
  )
}
