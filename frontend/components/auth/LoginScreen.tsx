import React, { useEffect } from 'react'
import { View, Alert, StatusBar, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SystemUI from 'expo-system-ui'
import { useAuth } from '../../hooks/useAuth'
import { GradientBackground } from './GradientBackground'
import { LoginHeader } from './LoginHeader'
import { FeaturesSection } from './FeaturesSection'
import { LoginForm } from './LoginForm'
import { LoginFooter } from './LoginFooter'

export const LoginScreen: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth()

  useEffect(() => {
    // Set background color for system UI
    SystemUI.setBackgroundColorAsync('#0078c7')

    // Hide status bar completely
    StatusBar.setHidden(true)

    // For Android, hide navigation bar and enable immersive mode
    if (Platform.OS === 'android') {
      // Hide navigation bar
      StatusBar.setTranslucent(true)

      // Try to use immersive mode to hide navigation bar
      // @ts-ignore - This is a React Native internal API
      if (global.__turboModuleProxy) {
        // @ts-ignore
        const NativeModules = require('react-native').NativeModules
        // @ts-ignore
        if (NativeModules.StatusBarManager) {
          // @ts-ignore
          NativeModules.StatusBarManager.setHidden(true)
        }
      }

      // Alternative approach for Android
      // @ts-ignore
      if (global.NavigationBar) {
        // @ts-ignore
        global.NavigationBar.setHidden(true)
      }
    }

    // For iOS, try to hide home indicator
    if (Platform.OS === 'ios') {
      // iOS doesn't have a direct API to hide home indicator
      // But we can make the status bar translucent and extend content
      StatusBar.setTranslucent(true)
    }
  }, [])

  const handleLogin = async (provider: 'google' | 'facebook' | 'discord') => {
    try {
      await login(provider)
    } catch (error) {
      Alert.alert(
        'Login Failed',
        'There was an error during login. Please try again.',
        [{ text: 'OK', onPress: clearError }],
      )
    }
  }

  const handleTermsPress = () => {
    // Handle terms of service press
    console.log('Terms of Service pressed')
  }

  const handlePrivacyPress = () => {
    // Handle privacy policy press
    console.log('Privacy Policy pressed')
  }

  return (
    <GradientBackground>
      <StatusBar
        barStyle="light-content"
        hidden={true}
        backgroundColor="transparent"
        translucent={true}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6">
          <LoginHeader />
          <FeaturesSection />
          <LoginForm
            onLogin={handleLogin}
            isLoading={isLoading}
            error={error || undefined}
            onClearError={clearError}
          />
          <LoginFooter
            onTermsPress={handleTermsPress}
            onPrivacyPress={handlePrivacyPress}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  )
}
