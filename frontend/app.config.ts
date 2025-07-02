import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Money Monitoring',
  slug: 'money-monitoring',
  owner: 'nazarenomarkanthony060120',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'moneymonitoring',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.moneymonitoring'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.yourcompany.moneymonitoring'
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    // Removed Google Sign-in plugin to prevent native module errors in Expo Go
    // '@react-native-google-signin/google-signin'
  ],
  extra: {
    router: {},
    eas: {
      projectId: "7c9ebbd3-0e1b-494f-bb1a-a37ab895d887"
    },
    backendApiUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000',
    googleSignInAndroidClientId: process.env.GOOGLE_SIGNIN_ANDROID_CLIENT_ID || '',
  }
}); 