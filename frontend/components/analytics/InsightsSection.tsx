import React from 'react'
import { View, Text } from 'react-native'
import { InsightCard } from './InsightCard'
import { InsightData } from '../../types/analytics'

interface InsightsSectionProps {
  insights: InsightData[]
  sectionTitle?: string
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  insights,
  sectionTitle = 'Smart Insights',
}) => {
  return (
    <View className="mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4">
        {sectionTitle}
      </Text>
      <View className="space-y-3">
        {insights.map((insight, index) => (
          <InsightCard
            key={`${insight.title}-${index}`}
            title={insight.title}
            description={insight.description}
            icon={insight.icon}
            type={insight.type}
          />
        ))}
      </View>
    </View>
  )
}
