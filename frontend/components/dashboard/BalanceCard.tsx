import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { BalanceData } from '../../types/dashboard'

interface BalanceCardProps extends BalanceData {
  onPress?: () => void
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  changePercentage,
  changeDescription,
  isPositiveChange = true,
  onPress,
}) => {
  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      onPress={onPress}
      className="bg-white rounded-2xl p-6 mx-6 -mt-4 shadow-lg border border-gray-100 active:scale-[0.98]"
      accessibilityLabel={`Total balance: ${balance}, ${isPositiveChange ? 'increased' : 'decreased'} by ${changePercentage} ${changeDescription}`}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-gray-600 text-sm font-medium mb-2">
            Total Balance
          </Text>
          <Text className="text-gray-900 text-3xl font-bold mb-3">
            {balance}
          </Text>
        </View>
        <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center">
          <Text className="text-2xl">💰</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              isPositiveChange ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <Text
            className={`text-sm font-semibold ${
              isPositiveChange ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositiveChange ? '+' : ''}
            {changePercentage}
          </Text>
          <Text className="text-gray-500 text-sm ml-2">
            {changeDescription}
          </Text>
        </View>

        <View className="flex-row">
          <Text
            className={`text-lg ${
              isPositiveChange ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositiveChange ? '↗️' : '↘️'}
          </Text>
        </View>
      </View>
    </Component>
  )
}
