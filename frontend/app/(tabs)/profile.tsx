import React from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import {
  ProfileHeader,
  SettingsSection,
  LogoutButton,
  AppVersion,
} from '../../components/profile'

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const { accountOptions, appOptions } = useProfile()

  const handleLogout = (): void => {
    logout()
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" testID="profile-screen">
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        testID="profile-scroll-view"
      >
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Settings Sections */}
        <View className="px-6 py-6">
          {/* Account Settings */}
          <SettingsSection
            title="Account Settings"
            options={accountOptions}
            testID="account-settings"
          />

          {/* App Settings */}
          <View className="mt-6">
            <SettingsSection
              title="App Settings"
              options={appOptions}
              testID="app-settings"
            />
          </View>

          {/* Logout Button */}
          <View className="mt-8">
            <LogoutButton onLogout={handleLogout} testID="logout-button" />
          </View>

          {/* App Version */}
          <AppVersion testID="app-version" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
