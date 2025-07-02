import '../global.css'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { LoginScreen } from '../components/auth/LoginScreen'
import { useAuth } from '../hooks/useAuth'

export default function AuthScreen() {
  const router = useRouter()
  const { loginWithTokenAndUser, isAuthenticated } = useAuth()

  useEffect(() => {
    // Check for OAuth callback parameters
    const handleOAuthCallback = async () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const userParam = urlParams.get('user')
        const error = urlParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          // Handle error - could show a toast or alert
          return
        }

        if (token && userParam) {
          try {
            const user = JSON.parse(decodeURIComponent(userParam))
            loginWithTokenAndUser(user, token)

            // Clear URL parameters
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            )

            // Navigate to home
            router.replace('/(tabs)/home')
          } catch (error) {
            console.error('Failed to process OAuth callback:', error)
          }
        }
      }
    }

    handleOAuthCallback()
  }, [loginWithTokenAndUser, router])

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home')
    }
  }, [isAuthenticated, router])

  return <LoginScreen />
}
