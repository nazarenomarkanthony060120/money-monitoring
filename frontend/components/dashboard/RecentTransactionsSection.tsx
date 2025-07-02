import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TransactionItem } from './TransactionItem'
import { Transaction } from '../../types/dashboard'

interface RecentTransactionsSectionProps {
  transactions: Transaction[]
  onViewAll?: () => void
  onTransactionPress?: (transaction: Transaction) => void
  title?: string
  maxItems?: number
}

export const RecentTransactionsSection: React.FC<
  RecentTransactionsSectionProps
> = ({
  transactions,
  onViewAll,
  onTransactionPress,
  title = 'Recent Transactions',
  maxItems = 5,
}) => {
  const displayTransactions = transactions.slice(0, maxItems)

  return (
    <View className="mb-8">
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <View className="px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 text-lg font-bold">{title}</Text>
            {onViewAll && transactions.length > 0 && (
              <TouchableOpacity
                onPress={onViewAll}
                className="px-3 py-1 bg-blue-50 rounded-full"
                accessibilityLabel="View all transactions"
                accessibilityRole="button"
              >
                <Text className="text-blue-600 font-semibold text-sm">
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="px-6">
          {displayTransactions.length > 0 ? (
            displayTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id || `transaction-${index}`}
                transaction={transaction}
                onPress={onTransactionPress}
                showBorder={index < displayTransactions.length - 1}
              />
            ))
          ) : (
            <View className="py-12 items-center">
              <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Text className="text-3xl">💳</Text>
              </View>
              <Text className="text-gray-900 font-semibold text-base mb-2">
                No transactions yet
              </Text>
              <Text className="text-gray-500 text-sm text-center max-w-xs">
                Start by adding your first transaction to see your financial
                activity
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
