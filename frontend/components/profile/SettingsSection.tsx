import React from 'react'
import { View, Text } from 'react-native'
import { ProfileOption } from './ProfileOption'
import { type SettingOption } from './types'

interface SettingsSectionProps {
  title: string
  options: SettingOption[]
  testID?: string
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  options,
  testID,
}) => {
  return (
    <View
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      testID={testID}
    >
      {/* Section Header */}
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-gray-900 text-lg font-bold">{title}</Text>
      </View>

      {/* Options List */}
      <View className="px-6">
        {options.map((option, index) => (
          <ProfileOption
            key={option.id}
            icon={option.icon}
            title={option.title}
            subtitle={option.subtitle}
            onPress={option.onPress}
            showBorder={index < options.length - 1}
            testID={`${testID}-option-${option.id}`}
          />
        ))}
      </View>
    </View>
  )
}
