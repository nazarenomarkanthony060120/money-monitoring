import React from 'react'
import { View, Text } from 'react-native'
import Constants from 'expo-constants'

interface AppVersionProps {
  testID?: string
}

export const AppVersion: React.FC<AppVersionProps> = ({ testID }) => {
  const getAppVersion = (): string => {
    const version = Constants.expoConfig?.version || '1.0.0'
    const buildNumber =
      Constants.expoConfig?.ios?.buildNumber ||
      Constants.expoConfig?.android?.versionCode ||
      '1'
    return `v${version} (${buildNumber})`
  }

  return (
    <View className="items-center mt-8 mb-12" testID={testID}>
      <Text className="text-gray-400 text-sm" accessibilityLabel="App version">
        Money Monitor {getAppVersion()}
      </Text>
    </View>
  )
}
