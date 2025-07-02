import React from 'react'
import { View, Text } from 'react-native'
import { QuickActionCard } from './QuickActionCard'
import { QuickAction } from '../../types/dashboard'

interface QuickActionsSectionProps {
  actions: QuickAction[]
  title?: string
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions,
  title = 'Quick Actions',
}) => {
  return (
    <View className="mb-8">
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <View className="px-6 py-4 border-b border-gray-100">
          <Text className="text-gray-900 text-lg font-bold">{title}</Text>
        </View>

        <View className="px-6">
          {actions.map((action, index) => (
            <QuickActionCard
              key={`${action.title}-${index}`}
              title={action.title}
              subtitle={action.subtitle}
              icon={action.icon}
              onPress={action.onPress}
              iconBackgroundColor={action.iconBackgroundColor}
              showBorder={index < actions.length - 1}
            />
          ))}
        </View>
      </View>
    </View>
  )
}
