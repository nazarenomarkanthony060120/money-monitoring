import React from 'react'
import { View, Text } from 'react-native'

interface LoginFooterProps {
  termsText?: string
  privacyText?: string
  onTermsPress?: () => void
  onPrivacyPress?: () => void
}

export const LoginFooter: React.FC<LoginFooterProps> = ({
  termsText = 'Terms of Service',
  privacyText = 'Privacy Policy',
  onTermsPress,
  onPrivacyPress,
}) => (
  <View className="items-center mt-8">
    <Text className="text-white/60 text-center text-sm leading-5">
      By continuing, you agree to our{' '}
      <Text className="text-white font-medium" onPress={onTermsPress}>
        {termsText}
      </Text>{' '}
      and{' '}
      <Text className="text-white font-medium" onPress={onPrivacyPress}>
        {privacyText}
      </Text>
    </Text>
  </View>
)
