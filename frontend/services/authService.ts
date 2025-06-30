import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

// OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google Client ID
const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID'; // Replace with your Facebook App ID

// Google OAuth Configuration
const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Facebook OAuth Configuration
const facebookDiscovery = {
  authorizationEndpoint: 'https://www.facebook.com/v12.0/dialog/oauth',
  tokenEndpoint: 'https://graph.facebook.com/v12.0/oauth/access_token',
};

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your backend URL

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'facebook' | 'email';
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Google OAuth
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'money-monitoring',
        path: 'auth',
      });

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      const result = await request.promptAsync(googleDiscovery);

      if (result.type === 'success') {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier!,
            },
          },
          googleDiscovery
        );

        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        const user: User = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          provider: 'google',
        };

        this.currentUser = user;
        await this.saveUserToStorage(user);
        await this.saveTokenToStorage(tokenResponse.accessToken);

        return {
          user,
          token: tokenResponse.accessToken,
        };
      } else {
        throw new Error('Google authentication was cancelled or failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Facebook OAuth
  async signInWithFacebook(): Promise<AuthResponse> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'money-monitoring',
        path: 'auth',
      });

      const request = new AuthSession.AuthRequest({
        clientId: FACEBOOK_APP_ID,
        scopes: ['public_profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync(facebookDiscovery);

      if (result.type === 'success') {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: FACEBOOK_APP_ID,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier!,
            },
          },
          facebookDiscovery
        );

        // Get user info from Facebook
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenResponse.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        const user: User = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture?.data?.url,
          provider: 'facebook',
        };

        this.currentUser = user;
        await this.saveUserToStorage(user);
        await this.saveTokenToStorage(tokenResponse.accessToken);

        return {
          user,
          token: tokenResponse.accessToken,
        };
      } else {
        throw new Error('Facebook authentication was cancelled or failed');
      }
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      throw error;
    }
  }

  // Email/Password Authentication
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture,
        provider: 'email',
      };

      this.currentUser = user;
      await this.saveUserToStorage(user);
      await this.saveTokenToStorage(data.token);

      return {
        user,
        token: data.token,
      };
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  // Sign Up with Email
  async signUpWithEmail(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture,
        provider: 'email',
      };

      this.currentUser = user;
      await this.saveUserToStorage(user);
      await this.saveTokenToStorage(data.token);

      return {
        user,
        token: data.token,
      };
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      this.currentUser = null;
      await AsyncStorage.multiRemove(['user', 'token']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get Current User
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    const token = await this.getToken();
    return !!(user && token);
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // Save user to storage
  private async saveUserToStorage(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Save user error:', error);
    }
  }

  // Save token to storage
  private async saveTokenToStorage(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error('Save token error:', error);
    }
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }
}

export default AuthService.getInstance(); 