import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

interface SummaryItem {
  title: string
  value: string
  subtitle: string
  icon: string
  color: string
  onPress?: () => void
}

interface DashboardSummaryProps {
  items: SummaryItem[]
  title?: string
}

const SummaryCard: React.FC<SummaryItem> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  onPress,
}) => {
  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      onPress={onPress}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 active:scale-95"
      accessibilityLabel={`${title}: ${value}, ${subtitle}`}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </View>

      <Text className="text-gray-600 text-sm font-medium mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900 mb-2">{value}</Text>
      <Text className="text-gray-500 text-xs">{subtitle}</Text>
    </Component>
  )
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  items,
  title = 'Financial Summary',
}) => {
  return (
    <View className="mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4 px-1">{title}</Text>
      <View className="flex-row flex-wrap gap-4">
        {items.map((item, index) => (
          <View key={`${item.title}-${index}`} className="flex-1 min-w-[45%]">
            <SummaryCard {...item} />
          </View>
        ))}
      </View>
    </View>
  )
}
