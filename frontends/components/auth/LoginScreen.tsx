import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AUTH_PROVIDERS } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

const { width } = Dimensions.get("window");

interface LoginButtonProps {
  provider: {
    id: "google" | "facebook" | "discord";
    name: string;
    icon: string;
    color: string;
  };
  onPress: () => void;
  isLoading: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  provider,
  onPress,
  isLoading,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={isLoading}
    className={`flex-row items-center justify-center px-6 py-4 rounded-2xl mb-4 border-2 ${
      isLoading ? "opacity-50" : "opacity-100"
    } active:scale-95`}
    style={{
      backgroundColor: provider.color,
      borderColor: provider.color,
      shadowColor: provider.color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    }}
  >
    {isLoading ? (
      <ActivityIndicator color="white" size="small" />
    ) : (
      <>
        <Text className="text-2xl mr-3">{provider.icon}</Text>
        <Text className="text-white font-bold text-lg">
          Continue with {provider.name}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

const FeatureCard = ({ icon, title, description }: any) => (
  <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
    <Text className="text-3xl mb-3">{icon}</Text>
    <Text className="text-white font-semibold text-base mb-1">{title}</Text>
    <Text className="text-white/80 text-sm">{description}</Text>
  </View>
);

export const LoginScreen: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async (provider: "google" | "facebook" | "discord") => {
    try {
      await login(provider);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "There was an error during login. Please try again.",
        [{ text: "OK", onPress: clearError }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <View className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />

      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-28 h-28 bg-white/20 rounded-full items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
            <Text className="text-white text-5xl font-bold">💰</Text>
          </View>
          <Text className="text-white text-4xl font-bold mb-3 text-center">
            Money Monitor
          </Text>
          <Text className="text-white/90 text-center text-lg leading-6">
            Take control of your finances with smart tracking and insights
          </Text>
        </View>

        {/* Features */}
        <View className="mb-8">
          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1">
              <FeatureCard
                icon="📊"
                title="Smart Analytics"
                description="Get insights into your spending patterns"
              />
            </View>
            <View className="flex-1">
              <FeatureCard
                icon="🎯"
                title="Budget Goals"
                description="Set and track your financial goals"
              />
            </View>
          </View>
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FeatureCard
                icon="🔒"
                title="Secure"
                description="Your data is encrypted and protected"
              />
            </View>
            <View className="flex-1">
              <FeatureCard
                icon="⚡"
                title="Fast & Simple"
                description="Quick setup and easy to use"
              />
            </View>
          </View>
        </View>

        {/* Login Section */}
        <View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <Text className="text-white text-center mb-6 text-xl font-semibold">
            Sign in to continue
          </Text>

          {AUTH_PROVIDERS.map((provider) => (
            <LoginButton
              key={provider.id}
              provider={provider}
              onPress={() => handleLogin(provider.id)}
              isLoading={isLoading}
            />
          ))}

          {/* Error Message */}
          {error && (
            <View className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
              <Text className="text-red-200 text-center font-medium">
                {error}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <Text className="text-white/60 text-center text-sm leading-5">
            By continuing, you agree to our{" "}
            <Text className="text-white font-medium">Terms of Service</Text> and{" "}
            <Text className="text-white font-medium">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
