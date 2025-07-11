import 'react-native-gesture-handler'
import '../global.css'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            statusBarHidden: true,
            statusBarStyle: 'light',
          }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'modal',
            statusBarStyle: 'light',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  )
}
