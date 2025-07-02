import React from 'react'
import { View, Text } from 'react-native'
import { BalanceData } from '../../types/dashboard'

interface BalanceCardProps extends BalanceData {}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  changePercentage,
  changeDescription,
  isPositiveChange = true,
}) => {
  return (
    <View className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm mx-6 -mt-4">
      <Text className="text-black text-sm font-medium mb-2">Total Balance</Text>
      <Text className="text-black text-3xl font-bold mb-4">{balance}</Text>
      <View className="flex-row items-center">
        <Text
          className={`text-sm font-medium ${
            isPositiveChange ? 'text-green-300' : 'text-red-300'
          }`}
        >
          {isPositiveChange ? '+' : ''}
          {changePercentage}
        </Text>
        <Text className="text-white/60 text-sm ml-2">{changeDescription}</Text>
      </View>
    </View>
  )
}
