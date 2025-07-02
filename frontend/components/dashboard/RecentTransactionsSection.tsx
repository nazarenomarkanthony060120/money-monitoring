import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TransactionItem } from './TransactionItem'
import { Transaction } from '../../types/dashboard'

interface RecentTransactionsSectionProps {
  transactions: Transaction[]
  onViewAll?: () => void
  onTransactionPress?: (transaction: Transaction) => void
}

export const RecentTransactionsSection: React.FC<
  RecentTransactionsSectionProps
> = ({ transactions, onViewAll, onTransactionPress }) => {
  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-gray-900 text-xl font-bold">
          Recent Transactions
        </Text>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            accessibilityLabel="View all transactions"
            accessibilityRole="button"
          >
            <Text className="text-blue-600 font-medium">View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id || index}
              transaction={transaction}
              onPress={onTransactionPress}
            />
          ))
        ) : (
          <View className="bg-white rounded-xl p-6 items-center shadow-sm border border-gray-100">
            <Text className="text-4xl mb-2">💳</Text>
            <Text className="text-gray-900 font-medium text-base mb-1">
              No transactions yet
            </Text>
            <Text className="text-gray-500 text-sm text-center">
              Start by adding your first transaction
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
