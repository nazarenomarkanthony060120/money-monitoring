import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'

const ProfileOption = ({
  icon,
  title,
  subtitle,
  onPress,
  showBorder = true,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center py-4 ${showBorder ? 'border-b border-gray-100' : ''}`}
  >
    <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center mr-4">
      <Text className="text-xl">{icon}</Text>
    </View>
    <View className="flex-1">
      <Text className="text-gray-900 font-medium text-base">{title}</Text>
      {subtitle && (
        <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
      )}
    </View>
    <Text className="text-gray-400 text-lg">›</Text>
  </TouchableOpacity>
)

export default function ProfileScreen() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 py-8">
          <View className="items-center">
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 backdrop-blur-sm">
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <Text className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              )}
            </View>
            <Text className="text-white text-2xl font-bold mb-2">
              {user?.name || 'User'}
            </Text>
            <Text className="text-white/80 text-lg mb-3">
              {user?.email || 'user@example.com'}
            </Text>
            <View className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Text className="text-white font-medium">
                {user?.provider
                  ? user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)
                  : 'Unknown'}{' '}
                User
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View className="px-6 py-6">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-gray-900 text-lg font-bold">
                Account Settings
              </Text>
            </View>

            <View className="px-6">
              <ProfileOption
                icon="👤"
                title="Edit Profile"
                subtitle="Update your personal information"
                onPress={() => {}}
              />
              <ProfileOption
                icon="🔒"
                title="Privacy Settings"
                subtitle="Manage your privacy preferences"
                onPress={() => {}}
              />
              <ProfileOption
                icon="🔔"
                title="Notifications"
                subtitle="Configure notification preferences"
                onPress={() => {}}
              />
              <ProfileOption
                icon="🌙"
                title="Dark Mode"
                subtitle="Switch between light and dark themes"
                onPress={() => {}}
              />
              <ProfileOption
                icon="❓"
                title="Help & Support"
                subtitle="Get help and contact support"
                onPress={() => {}}
                showBorder={false}
              />
            </View>
          </View>

          {/* App Settings */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-gray-900 text-lg font-bold">
                App Settings
              </Text>
            </View>

            <View className="px-6">
              <ProfileOption
                icon="💾"
                title="Data & Storage"
                subtitle="Manage app data and storage"
                onPress={() => {}}
              />
              <ProfileOption
                icon="🔄"
                title="Sync Settings"
                subtitle="Configure data synchronization"
                onPress={() => {}}
              />
              <ProfileOption
                icon="📊"
                title="Export Data"
                subtitle="Download your financial data"
                onPress={() => {}}
                showBorder={false}
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 py-4 rounded-2xl items-center mt-8 shadow-sm"
          >
            <Text className="text-white font-semibold text-lg">Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View className="items-center mt-8 mb-12">
            <Text className="text-gray-400 text-sm">Money Monitor v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
