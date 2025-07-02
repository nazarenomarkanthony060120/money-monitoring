import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { StatData } from '../../types/dashboard'

interface StatCardProps extends StatData {
  onPress?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  onPress,
}) => {
  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      onPress={onPress}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 active:scale-95"
      accessibilityLabel={`${title}: ${value}${trend ? `, trend: ${trend.isPositive ? 'up' : 'down'} ${trend.value}` : ''}`}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </View>

      <View className="mb-3">
        <Text className="text-gray-600 text-sm font-medium mb-1">{title}</Text>
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      </View>

      {trend && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                trend.isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Text
              className={`text-xs font-semibold ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.value}
            </Text>
          </View>
          <Text
            className={`text-sm ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '↗️' : '↘️'}
          </Text>
        </View>
      )}
    </Component>
  )
}
