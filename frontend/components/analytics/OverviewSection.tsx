import React from 'react'
import { View, Text } from 'react-native'
import { ChartCard } from './ChartCard'
import { OverviewData } from '../../types/analytics'

interface OverviewSectionProps {
  data: OverviewData[]
  sectionTitle?: string
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  data,
  sectionTitle = 'This Month',
}) => {
  return (
    <View className="mb-8">
      <Text className="text-white text-xl font-bold mb-4">{sectionTitle}</Text>
      <View className="space-y-4">
        {data.map((item, index) => (
          <ChartCard
            key={`${item.title}-${index}`}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </View>
    </View>
  )
}
