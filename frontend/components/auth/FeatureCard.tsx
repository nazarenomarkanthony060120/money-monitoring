import React from 'react'
import { View, Text } from 'react-native'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
    <Text className="text-3xl mb-3">{icon}</Text>
    <Text className="text-white font-semibold text-base mb-1">{title}</Text>
    <Text className="text-white/80 text-sm">{description}</Text>
  </View>
)
