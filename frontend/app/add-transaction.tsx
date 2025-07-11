import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import {
  AmountInput,
  CategorySelector,
  DatePickerInput,
  TypeSelector,
  PaymentMethodSelector,
  NotesInput,
  FormButton,
} from '../components/transaction'

export interface TransactionForm {
  amount: string
  type: 'income' | 'expense'
  category: string
  date: Date
  description: string
  notes: string
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other'
}

export default function AddTransactionScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<TransactionForm>({
    amount: '',
    type: 'income',
    category: '',
    date: new Date(),
    description: '',
    notes: '',
    paymentMethod: 'other',
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionForm, string>>
  >({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionForm, string>> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement API call to save transaction
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      Alert.alert('Success!', 'Transaction has been added successfully.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ])
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = <K extends keyof TransactionForm>(
    field: K,
    value: TransactionForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={['#667eea', '#764ba2']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">
              Add Transaction
            </Text>
            <View className="w-10 h-10" />
          </View>

          {/* Form Container */}
          <View className="flex-1 bg-gray-50 rounded-t-3xl mt-4">
            <ScrollView
              className="flex-1 px-6 py-6"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Transaction Type Selector */}
              <TypeSelector
                value={formData.type}
                onValueChange={(value) => {
                  console.log('Transaction type changed to:', value)
                  updateFormData('type', value)
                }}
                error={errors.type}
              />

              {/* Amount Input */}
              <AmountInput
                value={formData.amount}
                onValueChange={(value) => updateFormData('amount', value)}
                error={errors.amount}
              />

              {/* Category Selector */}
              <CategorySelector
                value={formData.category}
                type={formData.type}
                onValueChange={(value) => updateFormData('category', value)}
                error={errors.category}
              />

              {/* Description Input */}
              <NotesInput
                label="Description"
                value={formData.description}
                onValueChange={(value) => updateFormData('description', value)}
                placeholder="Enter transaction description..."
                error={errors.description}
                maxLength={200}
              />

              {/* Date Picker */}
              <DatePickerInput
                value={formData.date}
                onValueChange={(value) => updateFormData('date', value)}
                error={errors.date}
              />

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  updateFormData('paymentMethod', value)
                }
                error={errors.paymentMethod}
              />

              {/* Notes Input */}
              <NotesInput
                label="Notes (Optional)"
                value={formData.notes}
                onValueChange={(value) => updateFormData('notes', value)}
                placeholder="Add any additional notes..."
                error={errors.notes}
                maxLength={500}
                multiline
              />

              {/* Submit Button */}
              <FormButton
                title="Add Transaction"
                onPress={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading}
              />

              {/* Bottom spacing */}
              <View className="h-6" />
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}
