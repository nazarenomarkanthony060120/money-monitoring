import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Transaction } from '../../types/dashboard'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: (transaction: Transaction) => void
  showBorder?: boolean
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  showBorder = true,
}) => {
  const isPositive = transaction.amount.startsWith('+')

  const handlePress = () => {
    onPress?.(transaction)
  }

  const formatTime = (time: string) => {
    return time.charAt(0).toUpperCase() + time.slice(1)
  }

  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      onPress={handlePress}
      className={`flex-row items-center py-4 active:scale-95 ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
      accessibilityLabel={`Transaction: ${transaction.title}, ${transaction.amount}, ${transaction.time}${transaction.category ? `, Category: ${transaction.category}` : ''}`}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4">
        <Text className="text-xl">{transaction.icon}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base mb-1">
          {transaction.title}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm">
            {formatTime(transaction.time)}
          </Text>
          {transaction.category && (
            <>
              <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
              <Text className="text-gray-400 text-sm">
                {transaction.category}
              </Text>
            </>
          )}
        </View>
      </View>

      <View className="items-end">
        <Text
          className={`font-bold text-lg ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {transaction.amount}
        </Text>
        <View
          className={`w-2 h-2 rounded-full mt-1 ${
            isPositive ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </View>
    </Component>
  )
}
