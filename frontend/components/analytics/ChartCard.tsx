import React from 'react'
import { View, Text } from 'react-native'

interface ChartCardProps {
  title: string
  value: string
  change: number
  icon: string
  color: string
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const isPositiveChange = change >= 0

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            isPositiveChange ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              isPositiveChange ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositiveChange ? '+' : ''}
            {change}%
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm font-medium mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
    </View>
  )
}
