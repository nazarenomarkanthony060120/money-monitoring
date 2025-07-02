import React from 'react'
import { View, Text } from 'react-native'
import { StatCard } from './StatCard'
import { StatData } from '../../types/dashboard'

interface StatsGridProps {
  stats: StatData[]
  title?: string
  onStatPress?: (stat: StatData) => void
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  title = 'Overview',
  onStatPress,
}) => {
  return (
    <View className="mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4 px-1">{title}</Text>
      <View className="flex-row space-x-4">
        {stats.map((stat, index) => (
          <StatCard
            key={`${stat.title}-${index}`}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            onPress={onStatPress ? () => onStatPress(stat) : undefined}
          />
        ))}
      </View>
    </View>
  )
}
