import React from 'react'
import { View, Text } from 'react-native'
import { QuickActionCard } from './QuickActionCard'
import { QuickAction } from '../../types/dashboard'

interface QuickActionsSectionProps {
  actions: QuickAction[]
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions,
}) => {
  return (
    <View className="mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4">
        Quick Actions
      </Text>
      <View>
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            subtitle={action.subtitle}
            icon={action.icon}
            onPress={action.onPress}
            iconBackgroundColor={action.iconBackgroundColor}
          />
        ))}
      </View>
    </View>
  )
}
