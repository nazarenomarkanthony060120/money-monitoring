import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface PaymentMethod {
  id: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other'
  name: string
  icon: string
  color: string
}

interface PaymentMethodSelectorProps {
  value: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other'
  onValueChange: (
    value: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other',
  ) => void
  error?: string
}

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', icon: '💵', color: '#10B981' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', color: '#3B82F6' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', color: '#8B5CF6' },
  {
    id: 'digital_wallet',
    name: 'Digital Wallet',
    icon: '📱',
    color: '#F59E0B',
  },
  { id: 'other', name: 'Other', icon: '💰', color: '#6B7280' },
]

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onValueChange,
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const selectedMethod = paymentMethods.find((method) => method.id === value)

  const handleMethodSelect = (method: PaymentMethod) => {
    onValueChange(method.id)
    setIsModalVisible(false)
  }

  return (
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-3 text-base">
        Payment Method
      </Text>

      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className={`bg-white rounded-2xl border-2 ${
          error ? 'border-red-300' : 'border-gray-200'
        } shadow-sm`}
        accessibilityLabel="Select payment method"
      >
        <View className="flex-row items-center justify-between px-4 py-4">
          {selectedMethod ? (
            <View className="flex-row items-center flex-1">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                style={{ backgroundColor: selectedMethod.color + '20' }}
              >
                <Text className="text-2xl">{selectedMethod.icon}</Text>
              </View>
              <Text className="text-gray-800 font-semibold text-base">
                {selectedMethod.name}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500 text-base">
              Select payment method
            </Text>
          )}

          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>

      {error && (
        <View className="flex-row items-center mt-2 px-2">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-red-500 text-sm ml-2">{error}</Text>
        </View>
      )}

      {/* Payment Method Selection Modal */}
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
                Payment Method
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
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => handleMethodSelect(method)}
                className={`mb-4 p-4 rounded-2xl border-2 ${
                  selectedMethod?.id === method.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                accessibilityLabel={`${method.name} payment method`}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: method.color + '20' }}
                  >
                    <Text className="text-2xl">{method.icon}</Text>
                  </View>
                  <Text className="text-gray-800 font-semibold text-base">
                    {method.name}
                  </Text>
                  {selectedMethod?.id === method.id && (
                    <View className="ml-auto">
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#3B82F6"
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Bottom spacing */}
            <View className="h-6" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}
