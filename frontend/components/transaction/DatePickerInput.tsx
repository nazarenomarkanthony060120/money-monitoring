import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface DatePickerInputProps {
  value: Date
  onValueChange: (value: Date) => void
  error?: string
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onValueChange,
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isYesterday = (date: Date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return date.toDateString() === yesterday.toDateString()
  }

  const getDateDisplayText = (date: Date) => {
    if (isToday(date)) {
      return 'Today'
    }
    if (isYesterday(date)) {
      return 'Yesterday'
    }
    return formatShortDate(date)
  }

  // Generate quick date options
  const getQuickDateOptions = () => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    return [
      { label: 'Today', date: today, icon: '📅' },
      { label: 'Yesterday', date: yesterday, icon: '⏰' },
      { label: 'Last Week', date: thisWeek, icon: '📆' },
      { label: 'Last Month', date: lastMonth, icon: '🗓️' },
    ]
  }

  const handleDateSelect = (date: Date) => {
    onValueChange(date)
    setIsModalVisible(false)
  }

  return (
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-3 text-base">Date</Text>

      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className={`bg-white rounded-2xl border-2 ${
          error ? 'border-red-300' : 'border-gray-200'
        } shadow-sm`}
        accessibilityLabel="Select date"
      >
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="calendar" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-base">
                {getDateDisplayText(value)}
              </Text>
              <Text className="text-gray-500 text-sm">{formatDate(value)}</Text>
            </View>
          </View>

          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>

      {error && (
        <View className="flex-row items-center mt-2 px-2">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-red-500 text-sm ml-2">{error}</Text>
        </View>
      )}

      {/* Date Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-gray-50">
          <View className="bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between px-6 py-4">
              <Text className="text-xl font-semibold text-gray-800">
                Select Date
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 py-6">
            <Text className="text-gray-700 font-semibold mb-4 text-base">
              Quick Options
            </Text>

            {getQuickDateOptions().map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(option.date)}
                className={`mb-3 p-4 rounded-2xl border-2 ${
                  value.toDateString() === option.date.toDateString()
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                accessibilityLabel={`Select ${option.label}`}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{option.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold text-base">
                      {option.label}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {formatDate(option.date)}
                    </Text>
                  </View>
                  {value.toDateString() === option.date.toDateString() && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#3B82F6"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <View className="mt-6 mb-4">
              <Text className="text-gray-500 text-sm text-center">
                Note: For custom dates, you can use the device's date picker in
                a future update
              </Text>
            </View>

            {/* Bottom spacing */}
            <View className="h-6" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}
