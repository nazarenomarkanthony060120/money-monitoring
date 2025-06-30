import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";
import authService from "../services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<
    "email" | "google" | "facebook" | null
  >(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setLoadingType("email");
    try {
      const result = await authService.signInWithEmail(email, password);
      console.log("Login successful:", result.user.name);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoadingType("google");
    try {
      const result = await authService.signInWithGoogle();
      console.log("Google login successful:", result.user.name);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert(
        "Google Login Failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setLoadingType("facebook");
    try {
      const result = await authService.signInWithFacebook();
      console.log("Facebook login successful:", result.user.name);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Facebook login error:", error);
      Alert.alert(
        "Facebook Login Failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await authService.forgotPassword(email);
      Alert.alert(
        "Reset Email Sent",
        "If an account with this email exists, you will receive a password reset link."
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert("Error", "Failed to send reset email. Please try again.");
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isButtonDisabled = (type: "email" | "google" | "facebook"): boolean => {
    return isLoading || (type === "email" && (!email || !password));
  };

  const getButtonText = (type: "email" | "google" | "facebook"): string => {
    if (isLoading && loadingType === type) {
      return "Signing In...";
    }

    switch (type) {
      case "email":
        return "Sign In";
      case "google":
        return "Continue with Google";
      case "facebook":
        return "Continue with Facebook";
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6"
        >
          {/* Header */}
          <View className="items-center mb-12">
            <View
              className="w-20 h-20 rounded-full justify-center items-center mb-4"
              style={{ backgroundColor: colors.tint }}
            >
              <Ionicons name="wallet" size={40} color="white" />
            </View>
            <Text
              className="text-3xl font-bold mb-2 text-center"
              style={{ color: colors.text }}
            >
              Money Monitor
            </Text>
            <Text
              className="text-base text-center"
              style={{ color: colors.icon }}
            >
              Take control of your finances
            </Text>
          </View>

          {/* Login Form */}
          <View className="w-full">
            <Text
              className="text-2xl font-semibold mb-6 text-center"
              style={{ color: colors.text }}
            >
              Welcome Back
            </Text>

            {/* Email Input */}
            <View
              className="flex-row items-center border rounded-xl px-4 py-4 mb-4"
              style={{ borderColor: colors.icon }}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.icon}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base"
                style={{ color: colors.text }}
                placeholder="Email"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View
              className="flex-row items-center border rounded-xl px-4 py-4 mb-4"
              style={{ borderColor: colors.icon }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.icon}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base"
                style={{ color: colors.text }}
                placeholder="Password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.icon}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="self-end mb-6"
              disabled={isLoading}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: colors.tint }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center mb-6 ${isButtonDisabled("email") ? "opacity-60" : ""}`}
              style={{ backgroundColor: colors.tint }}
              onPress={handleEmailLogin}
              disabled={isButtonDisabled("email")}
            >
              {isLoading && loadingType === "email" ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  {getButtonText("email")}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View
                className="flex-1 h-px"
                style={{ backgroundColor: colors.icon }}
              />
              <Text className="mx-4 text-sm" style={{ color: colors.icon }}>
                or
              </Text>
              <View
                className="flex-1 h-px"
                style={{ backgroundColor: colors.icon }}
              />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              className={`flex-row items-center justify-center border rounded-xl py-4 mb-3 ${isButtonDisabled("google") ? "opacity-60" : ""}`}
              style={{ borderColor: colors.icon }}
              onPress={handleGoogleLogin}
              disabled={isButtonDisabled("google")}
            >
              {isLoading && loadingType === "google" ? (
                <ActivityIndicator color="#DB4437" size="small" />
              ) : (
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              )}
              <Text
                className="text-base font-medium ml-3"
                style={{ color: colors.text }}
              >
                {getButtonText("google")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-center border rounded-xl py-4 mb-3 ${isButtonDisabled("facebook") ? "opacity-60" : ""}`}
              style={{ borderColor: colors.icon }}
              onPress={handleFacebookLogin}
              disabled={isButtonDisabled("facebook")}
            >
              {isLoading && loadingType === "facebook" ? (
                <ActivityIndicator color="#4267B2" size="small" />
              ) : (
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              )}
              <Text
                className="text-base font-medium ml-3"
                style={{ color: colors.text }}
              >
                {getButtonText("facebook")}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-sm" style={{ color: colors.icon }}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.tint }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
