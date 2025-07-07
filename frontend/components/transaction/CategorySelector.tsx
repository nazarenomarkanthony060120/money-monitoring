import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

interface CategorySelectorProps {
  value: string
  type: 'income' | 'expense'
  onValueChange: (value: string) => void
  error?: string
}

// Mock categories - In a real app, these would come from an API
const mockCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Salary', icon: '💰', color: '#10B981', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💼', color: '#3B82F6', type: 'income' },
  { id: '3', name: 'Investment', icon: '📈', color: '#8B5CF6', type: 'income' },
  { id: '4', name: 'Business', icon: '🏢', color: '#F59E0B', type: 'income' },
  {
    id: '5',
    name: 'Other Income',
    icon: '🎁',
    color: '#EF4444',
    type: 'income',
  },

  // Expense categories
  {
    id: '6',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#EF4444',
    type: 'expense',
  },
  {
    id: '7',
    name: 'Transportation',
    icon: '🚗',
    color: '#3B82F6',
    type: 'expense',
  },
  { id: '8', name: 'Shopping', icon: '🛍️', color: '#8B5CF6', type: 'expense' },
  {
    id: '9',
    name: 'Entertainment',
    icon: '🎬',
    color: '#F59E0B',
    type: 'expense',
  },
  {
    id: '10',
    name: 'Healthcare',
    icon: '🏥',
    color: '#10B981',
    type: 'expense',
  },
  {
    id: '11',
    name: 'Education',
    icon: '📚',
    color: '#6366F1',
    type: 'expense',
  },
  { id: '12', name: 'Housing', icon: '🏠', color: '#EC4899', type: 'expense' },
  {
    id: '13',
    name: 'Utilities',
    icon: '⚡',
    color: '#F97316',
    type: 'expense',
  },
  {
    id: '14',
    name: 'Insurance',
    icon: '🛡️',
    color: '#06B6D4',
    type: 'expense',
  },
  {
    id: '15',
    name: 'Other Expenses',
    icon: '💸',
    color: '#6B7280',
    type: 'expense',
  },
]

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  type,
  onValueChange,
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )

  useEffect(() => {
    const filtered = mockCategories.filter((cat) => cat.type === type)
    setFilteredCategories(filtered)

    // Find selected category
    const selected = mockCategories.find((cat) => cat.id === value)
    setSelectedCategory(selected || null)
  }, [type, value])

  const handleCategorySelect = (category: Category) => {
    onValueChange(category.id)
    setSelectedCategory(category)
    setIsModalVisible(false)
  }

  return (
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-3 text-base">
        Category
      </Text>

      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className={`bg-white rounded-2xl border-2 ${
          error ? 'border-red-300' : 'border-gray-200'
        } shadow-sm`}
        accessibilityLabel="Select category"
      >
        <View className="flex-row items-center justify-between px-4 py-4">
          {selectedCategory ? (
            <View className="flex-row items-center flex-1">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                style={{ backgroundColor: selectedCategory.color + '20' }}
              >
                <Text className="text-2xl">{selectedCategory.icon}</Text>
              </View>
              <Text className="text-gray-800 font-semibold text-base">
                {selectedCategory.name}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500 text-base">Select a category</Text>
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

      {/* Category Selection Modal */}
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
                Select Category
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
            <View className="flex-row flex-wrap justify-between">
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategorySelect(category)}
                  className={`w-[47%] mb-4 p-4 rounded-2xl border-2 ${
                    selectedCategory?.id === category.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  accessibilityLabel={`${category.name} category`}
                >
                  <View className="items-center">
                    <View
                      className="w-16 h-16 rounded-3xl items-center justify-center mb-3"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <Text className="text-3xl">{category.icon}</Text>
                    </View>
                    <Text className="text-gray-800 font-semibold text-center text-sm">
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom spacing */}
            <View className="h-6" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}
