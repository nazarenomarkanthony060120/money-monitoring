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

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<
    "email" | "google" | "facebook" | null
  >(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleEmailSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(
        "Error",
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    setIsLoading(true);
    setLoadingType("email");
    try {
      const result = await authService.signUpWithEmail(email, password, name);
      console.log("Sign up successful:", result.user.name);

      Alert.alert("Welcome!", "Your account has been created successfully.", [
        {
          text: "Continue",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert(
        "Sign Up Failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setLoadingType("google");
    try {
      const result = await authService.signInWithGoogle();
      console.log("Google sign up successful:", result.user.name);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google sign up error:", error);
      Alert.alert(
        "Google Sign Up Failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleFacebookSignUp = async () => {
    setIsLoading(true);
    setLoadingType("facebook");
    try {
      const result = await authService.signInWithFacebook();
      console.log("Facebook sign up successful:", result.user.name);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Facebook sign up error:", error);
      Alert.alert(
        "Facebook Sign Up Failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleTermsPress = () => {
    Alert.alert(
      "Terms of Service",
      "Terms of Service content will be displayed here."
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      "Privacy Policy",
      "Privacy Policy content will be displayed here."
    );
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isButtonDisabled = (type: "email" | "google" | "facebook"): boolean => {
    return (
      isLoading ||
      (type === "email" &&
        (!name || !email || !password || !confirmPassword || !agreedToTerms))
    );
  };

  const getButtonText = (type: "email" | "google" | "facebook"): string => {
    if (isLoading && loadingType === type) {
      return "Creating Account...";
    }

    switch (type) {
      case "email":
        return "Create Account";
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
          <View className="items-center mb-8 relative">
            <TouchableOpacity
              onPress={handleBackToLogin}
              className="absolute left-0 top-0 p-2"
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
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
              Create Account
            </Text>
            <Text
              className="text-base text-center"
              style={{ color: colors.icon }}
            >
              Join Money Monitor today
            </Text>
          </View>

          {/* Sign Up Form */}
          <View className="w-full">
            {/* Name Input */}
            <View
              className="flex-row items-center border rounded-xl px-4 py-4 mb-4"
              style={{ borderColor: colors.icon }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.icon}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base"
                style={{ color: colors.text }}
                placeholder="Full Name"
                placeholderTextColor={colors.icon}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

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

            {/* Confirm Password Input */}
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
                placeholder="Confirm Password"
                placeholderTextColor={colors.icon}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1"
                disabled={isLoading}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.icon}
                />
              </TouchableOpacity>
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity
              className="flex-row items-center mb-6 flex-wrap"
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              disabled={isLoading}
            >
              <Ionicons
                name={agreedToTerms ? "checkbox" : "square-outline"}
                size={20}
                color={agreedToTerms ? colors.tint : colors.icon}
              />
              <Text className="text-sm" style={{ color: colors.text }}>
                I agree to the{" "}
              </Text>
              <TouchableOpacity onPress={handleTermsPress} disabled={isLoading}>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.tint }}
                >
                  Terms of Service
                </Text>
              </TouchableOpacity>
              <Text className="text-sm" style={{ color: colors.text }}>
                {" "}
                and{" "}
              </Text>
              <TouchableOpacity
                onPress={handlePrivacyPress}
                disabled={isLoading}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.tint }}
                >
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center mb-6 ${isButtonDisabled("email") ? "opacity-60" : ""}`}
              style={{ backgroundColor: colors.tint }}
              onPress={handleEmailSignUp}
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

            {/* Social Sign Up Buttons */}
            <TouchableOpacity
              className={`flex-row items-center justify-center border rounded-xl py-4 mb-3 ${isButtonDisabled("google") ? "opacity-60" : ""}`}
              style={{ borderColor: colors.icon }}
              onPress={handleGoogleSignUp}
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
              onPress={handleFacebookSignUp}
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

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-sm" style={{ color: colors.icon }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleBackToLogin}
                disabled={isLoading}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.tint }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
