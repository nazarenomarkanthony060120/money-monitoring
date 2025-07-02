import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, Text } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarStyle: Platform.select({
          default: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            elevation: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20, color }}>
              {focused ? '📊' : '📊'}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20, color }}>
              {focused ? '📈' : '📈'}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20, color }}>
              {focused ? '👤' : '👤'}
            </Text>
          ),
        }}
      />
    </Tabs>
  )
}
