import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AmountInputProps {
  value: string
  onValueChange: (value: string) => void
  error?: string
  currency?: string
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onValueChange,
  error,
  currency = '$',
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const formatAmount = (text: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '')

    // Ensure only one decimal point
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2)
    }

    return cleaned
  }

  const handleTextChange = (text: string) => {
    const formatted = formatAmount(text)
    onValueChange(formatted)
  }

  const clearAmount = () => {
    onValueChange('')
  }

  return (
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-3 text-base">Amount</Text>

      <View
        className={`bg-white rounded-2xl border-2 ${
          error
            ? 'border-red-300'
            : isFocused
              ? 'border-blue-400'
              : 'border-gray-200'
        } shadow-sm`}
      >
        <View className="flex-row items-center px-4 py-4">
          <Text className="text-gray-500 text-xl font-semibold mr-2">
            {currency}
          </Text>

          <TextInput
            value={value}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            className="flex-1 text-2xl font-bold text-gray-800"
            returnKeyType="done"
            accessibilityLabel="Transaction amount"
          />

          {value ? (
            <TouchableOpacity
              onPress={clearAmount}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              accessibilityLabel="Clear amount"
            >
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {error && (
        <View className="flex-row items-center mt-2 px-2">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-red-500 text-sm ml-2">{error}</Text>
        </View>
      )}
    </View>
  )
}
