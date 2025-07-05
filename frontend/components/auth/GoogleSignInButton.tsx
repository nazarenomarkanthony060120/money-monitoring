import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000'

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession()

interface GoogleAuthResult {
  token: string
  user: {
    id: string
    name: string
    email: string
    picture?: string
    provider: string
    isEmailVerified: boolean
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (result: GoogleAuthResult) => void
  onError?: (error: string) => void
  disabled?: boolean
  style?: any
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)

    try {
      // Generate mobile redirect URI
      const mobileRedirectUri = AuthSession.makeRedirectUri({
        scheme: process.env.EXPO_PUBLIC_SCHEME || 'moneymonitoring',
        path: 'oauth/callback',
      })

      console.log('Mobile redirect URI:', mobileRedirectUri)

      // Step 1: Get OAuth URL with PKCE challenge from backend
      const urlResponse = await fetch(
        `${BACKEND_URL}/api/auth/google/url?redirectUri=${encodeURIComponent(mobileRedirectUri)}`
      )

      if (!urlResponse.ok) {
        throw new Error('Failed to get Google OAuth URL')
      }

      const urlData = await urlResponse.json()

      if (!urlData.success || !urlData.data) {
        throw new Error('Invalid response from server')
      }

      const { authUrl, codeVerifier } = urlData.data

      // Step 2: Open OAuth URL in browser
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        mobileRedirectUri
      )

      if (result.type === 'success' && result.url) {
        // Step 3: Parse callback URL for either code or direct token
        console.log('OAuth callback received:', result.url)
        const url = new URL(result.url)
        
        // Check for errors first
        const error = url.searchParams.get('error')
        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        // Check for direct token response (from backend redirect)
        const token = url.searchParams.get('token')
        const success = url.searchParams.get('success')
        const userParam = url.searchParams.get('user')

        if (token && success === 'true') {
          console.log('Received direct token from backend:', token.substring(0, 20) + '...')
          
          // Parse user info
          let user: any = {
            id: 'unknown',
            name: 'User',
            email: 'user@example.com',
            provider: 'google',
            isEmailVerified: true,
          }

          if (userParam) {
            try {
              const parsedUser = JSON.parse(decodeURIComponent(userParam))
              user = {
                id: parsedUser.id || 'unknown',
                name: parsedUser.name || 'User',
                email: parsedUser.email || 'user@example.com',
                picture: parsedUser.picture,
                provider: parsedUser.provider || 'google',
                isEmailVerified: parsedUser.isEmailVerified || true,
              }
              console.log('Parsed user from backend:', {
                id: user.id,
                name: user.name,
                email: user.email,
              })
            } catch (error) {
              console.warn('Failed to parse user info:', error)
            }
          }

          // Success with direct token
          onSuccess({ token, user })
          return
        }

        // Fallback: Check for authorization code (original flow)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')

        if (!code) {
          throw new Error('No authorization code or token received')
        }

        console.log('Extracted OAuth parameters:', {
          hasCode: !!code,
          hasState: !!state,
          redirectUri: mobileRedirectUri,
        })

        // Step 4: Exchange code for tokens using PKCE verifier
        console.log('Exchanging code for tokens...')
        const tokenResponse = await fetch(
          `${BACKEND_URL}/api/auth/google/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              codeVerifier,
              state,
              redirectUri: mobileRedirectUri,
            }),
          },
        )

        console.log('Token exchange response status:', tokenResponse.status)

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          console.error('Token exchange error:', errorData)
          throw new Error(errorData.message || 'Token exchange failed')
        }

        const tokenData = await tokenResponse.json()
        console.log('Token exchange successful:', {
          hasToken: !!tokenData.data?.token,
          hasUser: !!tokenData.data?.user,
          success: tokenData.success,
        })

        if (tokenData.success && tokenData.data) {
          onSuccess(tokenData.data)
        } else {
          throw new Error(tokenData.message || 'Authentication failed')
        }
      } else if (result.type === 'cancel') {
        onError?.('User cancelled authentication')
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Google OAuth error:', error)
      onError?.(errorMessage)

      Alert.alert('Sign In Failed', `Google sign in failed: ${errorMessage}`, [
        { text: 'OK' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableOpacity
      className={`py-4 px-6 rounded-xl items-center justify-center shadow-lg mb-4 ${
        disabled || isLoading 
          ? 'bg-gray-300 shadow-none' 
          : 'bg-blue-500 shadow-md'
      }`}
      onPress={handleGoogleSignIn}
      disabled={disabled || isLoading}
      style={style}
    >
      <View className="flex-row items-center justify-center">
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" className="mr-2" />
        ) : (
          <>
            <View className="w-6 h-6 bg-white rounded-full items-center justify-center mr-3">
              <Text className="text-blue-500 text-xl font-bold">G</Text>
            </View>
            <Text className="text-white text-base font-semibold">
              Continue with Google
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}
