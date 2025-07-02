import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { User } from '../../types/dashboard'

interface DashboardHeaderProps {
  user: User | null
  onLogout: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onLogout,
}) => {
  const getUserInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U'
  }

  const getUserName = () => {
    return user?.name || 'User'
  }

  return (
    <LinearGradient
      colors={['#3b82f6', '#8b5cf6', '#6366f1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 pt-4 pb-8 rounded-b-3xl"
    >
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-white text-lg opacity-90">Welcome back,</Text>
          <Text className="text-white text-2xl font-bold">{getUserName()}</Text>
        </View>
        <TouchableOpacity
          onPress={onLogout}
          className="w-12 h-12 bg-white/20 rounded-full items-center justify-center active:scale-95"
          accessibilityLabel="Logout"
          accessibilityRole="button"
        >
          <Text className="text-white text-xl font-semibold">
            {getUserInitial()}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}
