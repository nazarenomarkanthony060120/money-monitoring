import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#6b7280",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          },
          default: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderTopWidth: 0,
            elevation: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20, color }}>
              {focused ? "🏠" : "🏠"}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20, color }}>
              {focused ? "📊" : "📊"}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20, color }}>
              {focused ? "👤" : "👤"}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
