import React from 'react'
import { View, Text } from 'react-native'

export type InsightType = 'positive' | 'warning' | 'info'

interface InsightCardProps {
  title: string
  description: string
  icon: string
  type: InsightType
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  icon,
  type,
}) => {
  const getBackgroundColor = (type: InsightType): string => {
    switch (type) {
      case 'positive':
        return 'bg-green-100'
      case 'warning':
        return 'bg-yellow-100'
      case 'info':
      default:
        return 'bg-blue-100'
    }
  }

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-start">
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${getBackgroundColor(
            type,
          )}`}
        >
          <Text className="text-xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base mb-1">
            {title}
          </Text>
          <Text className="text-gray-600 text-sm leading-5">{description}</Text>
        </View>
      </View>
    </View>
  )
}
