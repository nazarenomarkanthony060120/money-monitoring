import React from 'react'
import { View, Text } from 'react-native'

interface CategoryItemProps {
  category: string
  amount: string
  percentage: number
  color: string
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  amount,
  percentage,
  color,
}) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <View className="flex-row items-center flex-1">
        <View
          className="w-3 h-3 rounded-full mr-3"
          style={{ backgroundColor: color }}
        />
        <Text className="text-gray-900 font-medium">{category}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-gray-900 font-semibold mr-3">{amount}</Text>
        <Text className="text-gray-500 text-sm">{percentage}%</Text>
      </View>
    </View>
  )
}
