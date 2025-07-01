import React from 'react'
import { View, Text } from 'react-native'

interface LoginHeaderProps {
  logo?: string
  title?: string
  description?: string
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  logo = '💰',
  title = 'Money Monitor',
  description = 'Take control of your finances with smart tracking and insights',
}) => (
  <View className="items-center mb-12">
    <View className="w-28 h-28 bg-white/20 rounded-full items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
      <Text className="text-white text-5xl font-bold">{logo}</Text>
    </View>
    <Text className="text-white text-4xl font-bold mb-3 text-center">
      {title}
    </Text>
    <Text className="text-white/90 text-center text-lg leading-6">
      {description}
    </Text>
  </View>
)
