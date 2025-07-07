import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface NotesInputProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  error?: string
  placeholder?: string
  maxLength?: number
  multiline?: boolean
}

export const NotesInput: React.FC<NotesInputProps> = ({
  label,
  value,
  onValueChange,
  error,
  placeholder = 'Enter text...',
  maxLength = 200,
  multiline = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const clearText = () => {
    onValueChange('')
  }

  const remainingChars = maxLength - value.length

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-700 font-semibold text-base">{label}</Text>
        {maxLength && (
          <Text
            className={`text-sm ${
              remainingChars < 20 ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {remainingChars}/{maxLength}
          </Text>
        )}
      </View>

      <View
        className={`bg-white rounded-2xl border-2 ${
          error
            ? 'border-red-300'
            : isFocused
              ? 'border-blue-400'
              : 'border-gray-200'
        } shadow-sm`}
      >
        <View className="flex-row items-start px-4 py-4">
          <TextInput
            value={value}
            onChangeText={onValueChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className={`flex-1 text-gray-800 font-medium ${
              multiline ? 'min-h-[80px]' : 'text-base'
            }`}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            maxLength={maxLength}
            returnKeyType={multiline ? 'default' : 'done'}
            accessibilityLabel={label}
          />

          {value ? (
            <TouchableOpacity
              onPress={clearText}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center ml-2"
              accessibilityLabel="Clear text"
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
