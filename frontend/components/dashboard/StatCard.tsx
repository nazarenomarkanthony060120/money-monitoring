import React from 'react'
import { View, Text } from 'react-native'
import { StatData } from '../../types/dashboard'

interface StatCardProps extends StatData {}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1">
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center">
          <Text className="text-xl">{icon}</Text>
        </View>
        <View
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </View>

      <Text className="text-gray-600 text-sm font-medium mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900 mb-2">{value}</Text>

      {trend && (
        <View className="flex-row items-center">
          <Text
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↗' : '↘'} {trend.value}
          </Text>
        </View>
      )}
    </View>
  )
}
