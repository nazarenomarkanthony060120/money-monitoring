import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
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
      // Step 1: Get OAuth URL with PKCE challenge from backend
      const urlResponse = await fetch(`${BACKEND_URL}/api/auth/google/url`)

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
        AuthSession.makeRedirectUri({
          scheme: process.env.EXPO_PUBLIC_SCHEME || 'moneymonitoring',
          path: 'oauth/callback',
        }),
      )

      if (result.type === 'success' && result.url) {
        // Step 3: Extract authorization code from callback URL
        const url = new URL(result.url)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')

        if (!code) {
          throw new Error('No authorization code received')
        }

        // Step 4: Exchange code for tokens using PKCE verifier
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
            }),
          },
        )

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          throw new Error(errorData.message || 'Token exchange failed')
        }

        const tokenData = await tokenResponse.json()

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
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={handleGoogleSignIn}
      disabled={disabled || isLoading}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" style={styles.loader} />
        ) : (
          <>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    color: '#4285F4',
    width: 24,
    height: 24,
    textAlign: 'center',
    borderRadius: 12,
    marginRight: 12,
    lineHeight: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginRight: 8,
  },
})
