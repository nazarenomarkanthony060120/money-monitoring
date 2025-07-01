import React from 'react'
import { View } from 'react-native'

interface GradientBackgroundProps {
  topColor?: string
  middleColor?: string
  bottomColor?: string
  children: React.ReactNode
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  topColor = '#42b4ff',
  middleColor = '#219ced',
  bottomColor = '#0078c7',
  children,
}) => (
  <View className="flex-1" style={{ backgroundColor: bottomColor }}>
    {/* Multi-layer gradient background */}
    <View
      className="absolute inset-0"
      style={{
        backgroundColor: bottomColor,
      }}
    />

    {/* Middle blue overlay for gradient effect */}
    <View
      className="absolute inset-0 opacity-60"
      style={{
        backgroundColor: middleColor,
      }}
    />

    {/* Top light blue overlay for gradient effect */}
    <View
      className="absolute inset-0 opacity-40"
      style={{
        backgroundColor: topColor,
      }}
    />

    {/* Subtle overlay pattern using multiple circles */}
    <View className="absolute inset-0 opacity-20">
      <View className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full" />
      <View className="absolute top-40 right-16 w-24 h-24 bg-white/10 rounded-full" />
      <View className="absolute bottom-32 left-16 w-28 h-28 bg-white/10 rounded-full" />
      <View className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full" />
    </View>

    {/* Top accent gradient */}
    <View
      className="absolute top-0 left-0 right-0 h-96 opacity-30"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    />

    {/* Bottom accent gradient */}
    <View
      className="absolute bottom-0 left-0 right-0 h-96 opacity-20"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    />

    {children}
  </View>
)
