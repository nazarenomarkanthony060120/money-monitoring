import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Transaction } from '../../types/dashboard'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: (transaction: Transaction) => void
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const isPositive = transaction.amount.startsWith('+')

  const handlePress = () => {
    onPress?.(transaction)
  }

  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      onPress={handlePress}
      className="bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100 mb-3"
      {...(onPress && {
        accessibilityLabel: `Transaction: ${transaction.title}, ${transaction.amount}`,
        accessibilityRole: 'button' as const,
      })}
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
        <Text className="text-lg">{transaction.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-medium text-base">
          {transaction.title}
        </Text>
        <Text className="text-gray-500 text-sm">{transaction.time}</Text>
        {transaction.category && (
          <Text className="text-gray-400 text-xs mt-1">
            {transaction.category}
          </Text>
        )}
      </View>
      <Text
        className={`font-bold text-lg ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {transaction.amount}
      </Text>
    </Component>
  )
}
