import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

const { width } = Dimensions.get("window");

const StatCard = ({ title, value, icon, color }: any) => (
  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-2xl">{icon}</Text>
      <View
        className={`w-3 h-3 rounded-full`}
        style={{ backgroundColor: color }}
      />
    </View>
    <Text className="text-gray-600 text-sm font-medium">{title}</Text>
    <Text className="text-2xl font-bold text-gray-900">{value}</Text>
  </View>
);

const QuickActionCard = ({ title, subtitle, icon, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95"
  >
    <View className="flex-row items-center">
      <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-4">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base">{title}</Text>
        <Text className="text-gray-500 text-sm">{subtitle}</Text>
      </View>
      <Text className="text-gray-400 text-lg">›</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 pt-4 pb-8 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white text-lg opacity-90">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">
              {user?.name || "User"}
            </Text>
          </View>
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <Text className="text-white text-xl">
              {user?.name?.charAt(0) || "U"}
            </Text>
          </View>
        </View>

        {/* Balance Card */}
        <View className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
          <Text className="text-white/80 text-sm font-medium mb-2">
            Total Balance
          </Text>
          <Text className="text-white text-3xl font-bold mb-4">$2,450.00</Text>
          <View className="flex-row items-center">
            <Text className="text-green-300 text-sm font-medium">+12.5%</Text>
            <Text className="text-white/60 text-sm ml-2">from last month</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View className="mt-6 mb-8">
          <Text className="text-gray-900 text-xl font-bold mb-4">Overview</Text>
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <StatCard
                title="Income"
                value="$3,200"
                icon="📈"
                color="#10b981"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Expenses"
                value="$750"
                icon="📉"
                color="#ef4444"
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Quick Actions
          </Text>
          <View className="space-y-3">
            <QuickActionCard
              title="Add Transaction"
              subtitle="Record income or expense"
              icon="➕"
              onPress={() => {}}
            />
            <QuickActionCard
              title="View Analytics"
              subtitle="See spending patterns"
              icon="📊"
              onPress={() => {}}
            />
            <QuickActionCard
              title="Set Budget"
              subtitle="Create spending limits"
              icon="🎯"
              onPress={() => {}}
            />
            <QuickActionCard
              title="Export Report"
              subtitle="Download financial data"
              icon="📄"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 text-xl font-bold">
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {[
              {
                title: "Coffee Shop",
                amount: "-$4.50",
                time: "2 hours ago",
                icon: "☕",
              },
              {
                title: "Grocery Store",
                amount: "-$85.20",
                time: "Yesterday",
                icon: "🛒",
              },
              {
                title: "Salary",
                amount: "+$3,200",
                time: "2 days ago",
                icon: "💰",
              },
            ].map((transaction, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-lg">{transaction.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">
                    {transaction.title}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {transaction.time}
                  </Text>
                </View>
                <Text
                  className={`font-bold text-lg ${transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
