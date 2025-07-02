import React from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: onLogout,
      },
    ])
  }

  return (
    <LinearGradient
      colors={['#42b4ff', '#219ced', '#0078c7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 pt-4 pb-8"
    >
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1">
          <Text className="text-white/90 text-base font-medium mb-1">
            {getGreeting()},
          </Text>
          <Text className="text-white text-2xl font-bold mb-2">
            {getUserName()}
          </Text>
          <Text className="text-white/80 text-sm">
            Welcome to your financial dashboard
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogoutPress}
          className="w-14 h-14 bg-white/20 rounded-full items-center justify-center active:scale-95 backdrop-blur-sm"
          accessibilityLabel={`User profile: ${getUserName()}, tap to logout`}
          accessibilityRole="button"
        >
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-14 h-14 rounded-full"
              accessibilityLabel={`${getUserName()}'s profile picture`}
            />
          ) : (
            <Text className="text-white text-xl font-bold">
              {getUserInitial()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}
