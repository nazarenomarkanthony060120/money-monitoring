import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

interface TypeSelectorProps {
  value: 'income' | 'expense'
  onValueChange: (value: 'income' | 'expense') => void
  error?: string
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  value,
  onValueChange,
  error,
}) => {
  return (
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-3 text-base">
        Transaction Type
      </Text>

      <View className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => onValueChange('income')}
            className={`flex-1 py-3 px-4 rounded-xl ${
              value === 'income' ? 'bg-green-500 shadow-md' : 'bg-transparent'
            }`}
            accessibilityLabel="Income transaction"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-2">💰</Text>
              <Text
                className={`font-semibold ${
                  value === 'income' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Income
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onValueChange('expense')}
            className={`flex-1 py-3 px-4 rounded-xl ${
              value === 'expense' ? 'bg-red-500 shadow-md' : 'bg-transparent'
            }`}
            accessibilityLabel="Expense transaction"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-2">💸</Text>
              <Text
                className={`font-semibold ${
                  value === 'expense' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Expense
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View className="flex-row items-center mt-2 px-2">
          <Text className="text-red-500 text-sm">{error}</Text>
        </View>
      )}
    </View>
  )
}
