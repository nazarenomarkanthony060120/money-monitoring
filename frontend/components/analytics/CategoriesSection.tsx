import React from 'react'
import { View, Text } from 'react-native'
import { CategoryItem } from './CategoryItem'
import { CategoryData } from '../../types/analytics'

interface CategoriesSectionProps {
  categories: CategoryData[]
  sectionTitle?: string
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  sectionTitle = 'Top Categories',
}) => {
  return (
    <View className="mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4">
        {sectionTitle}
      </Text>
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {categories.map((item, index) => (
          <CategoryItem
            key={`${item.category}-${index}`}
            category={item.category}
            amount={item.amount}
            percentage={item.percentage}
            color={item.color}
          />
        ))}
      </View>
    </View>
  )
}
