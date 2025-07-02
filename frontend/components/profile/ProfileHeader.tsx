import React from 'react'
import { View, Text, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { type User } from './types'
import { PROFILE_COLORS } from '../../constants/profileSettings'

interface ProfileHeaderProps {
  user?: User | null
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const getInitials = (name?: string): string => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatProviderName = (provider?: string): string => {
    if (!provider) return 'Unknown'
    return provider.charAt(0).toUpperCase() + provider.slice(1)
  }

  return (
    <LinearGradient
      colors={PROFILE_COLORS.gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 py-8"
    >
      <View className="items-center">
        {/* Profile Avatar */}
        <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 backdrop-blur-sm">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-white text-2xl font-bold">
              {getInitials(user?.name)}
            </Text>
          )}
        </View>

        {/* User Name */}
        <Text className="text-white text-2xl font-bold mb-2" numberOfLines={1}>
          {user?.name || 'User'}
        </Text>

        {/* User Email */}
        <Text className="text-white/80 text-base mb-3" numberOfLines={1}>
          {user?.email || 'user@example.com'}
        </Text>

        {/* Provider Badge */}
        <View className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
          <Text className="text-white font-medium text-sm">
            {formatProviderName(user?.provider)} User
          </Text>
        </View>
      </View>
    </LinearGradient>
  )
}
