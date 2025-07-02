import React from 'react'
import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface AnalyticsHeaderProps {
  title: string
  subtitle: string
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <LinearGradient
      colors={['#2563eb', '#7c3aed']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="px-6 py-8"
    >
      <Text className="text-white text-3xl font-bold mb-2">{title}</Text>
      <Text className="text-white/80 text-lg">{subtitle}</Text>
    </LinearGradient>
  )
}
