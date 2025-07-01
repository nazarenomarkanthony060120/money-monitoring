import React from 'react'
import { View } from 'react-native'
import { FeatureCard } from './FeatureCard'

interface Feature {
  icon: string
  title: string
  description: string
}

interface FeaturesSectionProps {
  features?: Feature[]
}

const defaultFeatures: Feature[] = [
  {
    icon: '📊',
    title: 'Smart Analytics',
    description: 'Get insights into your spending patterns',
  },
  {
    icon: '🎯',
    title: 'Budget Goals',
    description: 'Set and track your financial goals',
  },
  {
    icon: '🔒',
    title: 'Secure',
    description: 'Your data is encrypted and protected',
  },
  {
    icon: '⚡',
    title: 'Fast & Simple',
    description: 'Quick setup and easy to use',
  },
]

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = defaultFeatures,
}) => {
  const firstRow = features.slice(0, 2)
  const secondRow = features.slice(2, 4)

  return (
    <View className="mb-8">
      <View className="flex-row space-x-3 mb-4 gap-3">
        {firstRow.map((feature, index) => (
          <View key={index} className="flex-1">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </View>
        ))}
      </View>
      <View className="flex-row space-x-3 gap-3">
        {secondRow.map((feature, index) => (
          <View key={index} className="flex-1">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </View>
        ))}
      </View>
    </View>
  )
}
