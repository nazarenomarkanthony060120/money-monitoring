import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { QuickAction } from '../../types/analytics'

interface QuickActionsSectionProps {
  actions: QuickAction[]
  sectionTitle?: string
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions,
  sectionTitle = 'Quick Actions',
}) => {
  return (
    <View className="mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4">
        {sectionTitle}
      </Text>
      <View className="flex-row space-x-3">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={`${action.title}-${index}`}
            className={`flex-1 py-4 rounded-xl items-center ${
              action.variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <Text
              className={`font-semibold ${
                action.variant === 'primary' ? 'text-white' : 'text-gray-700'
              }`}
            >
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
