import React from 'react'
import { View, Text } from 'react-native'
import { StatCard } from './StatCard'
import { StatData } from '../../types/dashboard'

interface StatsGridProps {
  stats: StatData[]
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <View className="mt-6 mb-8">
      <Text className="text-gray-900 text-xl font-bold mb-4">Overview</Text>
      <View className="flex-row space-x-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </View>
    </View>
  )
}
