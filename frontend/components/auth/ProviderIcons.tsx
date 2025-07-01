import React from 'react'
import { View, Text } from 'react-native'

interface ProviderIconProps {
  provider: 'google' | 'facebook' | 'discord'
  size?: number
  color?: string
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({
  provider,
  size = 24,
  color = 'white',
}) => {
  const iconStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  }

  const textStyle = {
    fontSize: size * 0.6,
    fontWeight: 'bold' as const,
    color: 'white',
  }

  switch (provider) {
    case 'google':
      return (
        <View style={[iconStyle, { backgroundColor: '#4285F4' }]}>
          <Text style={textStyle}>G</Text>
        </View>
      )

    case 'facebook':
      return (
        <View style={[iconStyle, { backgroundColor: '#1877F2' }]}>
          <Text style={textStyle}>f</Text>
        </View>
      )

    case 'discord':
      return (
        <View style={[iconStyle, { backgroundColor: '#5865F2' }]}>
          <Text style={textStyle}>D</Text>
        </View>
      )

    default:
      return null
  }
}
